<?php

namespace App\Model;

use Core\Conexion;

class Plato extends Conexion
{

    public $table = 'plato';

    public function __construct()
    {
        parent::__construct($this->table);
    }

    public function all()
    {
        return $this->getAll();
    }

    //Metodo para listar los platos para los pedidos
    public function lista() 
    {
        $sql = "SELECT 
            a.id, a.nombre, a.descripcion, a.precio, b.nombre AS tipo, 'plato' AS categoria 
            FROM {$this->table} a 
            INNER JOIN tipo_plato b ON a.tipo_plato_id = b.id 
            WHERE a.estado = 1;";
        $stm = $this->query($sql);
        return $stm->fetchAll(\PDO::FETCH_OBJ);
    }

    public function save($data, $file)
    {
        $imagen = $file;
        $sql = "INSERT INTO {$this->table} (nombre, precio, descripcion, estado, tipo_plato_id) VALUES (?, ?, ?, ?, ?);";
        $conexion = $this->conectar();
        $stm = $conexion->prepare($sql);

        $stm->bindValue(1, $data['nombre']);
        $stm->bindValue(2, $data['precio']);
        $stm->bindValue(3, $data['descripcion']);
        $stm->bindValue(4, 1);
        $stm->bindValue(5, $data['tipo']);
        if ($stm->execute()) {
            if (!empty($imagen)) {
                $type = $imagen['type'] == 'image/jpeg' ? '.jpg' : '.png';
                $id =$conexion->lastInsertId();
                $nombreImagen = 'plato-' . $id . $type;
                move_uploaded_file($imagen['tmp_name'], 'storage/image/platos/' . $nombreImagen);
                $this->query("UPDATE {$this->table} SET imagen = '{$nombreImagen}' WHERE id = {$id};");
            }
            return true;
        } else {
            return false;
        }

        $stm = null;
    }

    public function update($data, $file)
    {
        $imagen = $file;
        $sql = "UPDATE {$this->table} SET nombre = ?, precio = ?, descripcion = ?, tipo_plato_id = ? WHERE id = ?;";
        $stm = $this->prepare($sql);

        $stm->bindValue(1, $data['nombre']);
        $stm->bindValue(2, $data['precio']);
        $stm->bindValue(3, $data['descripcion']);
        $stm->bindValue(4, $data['tipo']);
        $stm->bindValue(5, $data['codigo']);
        if ($stm->execute()) {
            if (!empty($imagen['tmp_name'])) {
                $type = $imagen['type'] == 'image/jpeg' ? '.jpg' : '.png';
                $id = $data['codigo'];
                $nombreImagen = 'plato-' . $id . $type;
                move_uploaded_file($imagen['tmp_name'], 'storage/image/platos/' . $nombreImagen);
                $this->query("UPDATE {$this->table} SET imagen = '{$nombreImagen}' WHERE id = {$id};");
            }
            return true;
        } else {
            return false;
        }

        $stm = null;
    }

    public function get($id)
    {
        return $this->getById($id);
    }

    public function updateEstado($id)
    {
        $query = $this->query("SELECT estado FROM {$this->table} WHERE id = {$id};");
        $estado = $query->fetch(\PDO::FETCH_OBJ);
        $estado = $estado->estado == 1 ? 0 : 1;
        $sql = "UPDATE {$this->table} SET estado = ? WHERE id = ?;";
        $stm = $this->prepare($sql);
        $stm->bindValue(1, $estado);
        $stm->bindValue(2, $id);
        return $stm->execute();
    }

    public function tipos()
    {
        $stm = $this->query("SELECT * FROM tipo_plato;");
        return $stm->fetchAll(\PDO::FETCH_OBJ);
    }

    public function count()
    {
        $hoy = date("Y-m-d"); 
        $sql = "SELECT COUNT(id) AS cantidad FROM {$this->table};";
        $stm = $this->query($sql);
        return $stm->fetch(\PDO::FETCH_OBJ);
    }

}
