<?php

namespace App\Model;

use Core\Conexion;

class Bebida extends Conexion
{

    public $table = 'bebida';

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
        $sql = "SELECT id, nombre, '' AS descripcion, precio, 'bebida' AS tipo, 'bebida' AS categoria FROM {$this->table}  WHERE estado = 1;";
        $stm = $this->query($sql);
        return $stm->fetchAll(\PDO::FETCH_OBJ);
    }

    public function save($data)
    {
        $sql = "INSERT INTO {$this->table} (nombre, precio) VALUES (?, ?);";
        $stm = $this->prepare($sql);

        $stm->bindValue(1, $data['nombre']);
        $stm->bindValue(2, $data['precio']);
        return $stm->execute();

        $stm = null;

    }

    public function update($data)
    {
        $sql = "UPDATE {$this->table} SET nombre = ?, precio = ? WHERE id = ?;";
        $stm = $this->prepare($sql);

        $stm->bindValue(1, $data['nombre']);
        $stm->bindValue(2, $data['precio']);
        $stm->bindValue(3, $data['codigo']);
        return $stm->execute();

        $stm = null;

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

    public function get($id) 
    {
        return $this->getById($id);
    }


}
