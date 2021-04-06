<?php

namespace App\Model;

use Core\Conexion;

class Usuario extends Conexion
{

    public $table = 'usuario';

    public function __construct()
    {
        parent::__construct($this->table);
    }

    public function all()
    {
        $sql = "SELECT a.id, b.nombre AS empleado, a.email, a.rol, a.estado, a.created_at AS fecha FROM {$this->table} a INNER JOIN empleado b ON a.empleado_id = b.id;";
        $stm = $this->query($sql);
        return $stm->fetchAll(\PDO::FETCH_OBJ);
        //return $this->getAll();
    }

    public function save($data)
    {
        $opciones = [
            'cost' => 12,
        ];
        $sql = "INSERT INTO {$this->table} (empleado_id, email, pass, rol, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);";
        $conexion = $this->conectar();
        $stm = $conexion->prepare($sql);
        $hoy = date("Y-m-d H:i:s"); 
        $stm->bindValue(1, $data['empleado']);
        $stm->bindValue(2, $data['email']);
        $stm->bindValue(3, password_hash($data['pass'], PASSWORD_BCRYPT, $opciones));
        $stm->bindValue(4, $data['rol']);
        $stm->bindValue(5, $hoy);
        $stm->bindValue(6, $hoy);
        return $stm->execute();
        $stm = null;
    }

    public function update($data)
    {
        $sql = "UPDATE {$this->table} SET empleado_id = ?, email = ?, rol = ?, updated_at = ? WHERE id = ?;";
        $stm = $this->prepare($sql);
        $hoy = date("Y-m-d H:i:s");
        $stm->bindValue(1, $data['empleado']);
        $stm->bindValue(2, $data['email']);
        $stm->bindValue(3, $data['rol']);
        $stm->bindValue(4, $hoy);
        $stm->bindValue(5, $data['codigo']);
        if ($stm->execute()) {

            if (!empty($data['pass'])) {
                $opciones = [
                    'cost' => 12,
                ];
                $id = $data['codigo'];
                $pass = password_hash($data['pass'], PASSWORD_BCRYPT, $opciones);
                $this->query("UPDATE {$this->table} SET pass = '{$pass}' WHERE id = {$id};");
            }

            return true;
        }
        return false;
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

    public function validarEmail(string $email)
    {
        $sql = "SELECT a.id, a.email, a.pass, a.rol, a.estado, b.nombre AS empleado FROM {$this->table} a INNER JOIN empleado b ON a.empleado_id = b.id WHERE email = '{$email}';";
        $stm = $this->query($sql);
        return $stm->fetch(\PDO::FETCH_OBJ);
    }

}
