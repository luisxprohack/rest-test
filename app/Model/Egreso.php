<?php

namespace App\Model;

use Core\Conexion;

class Egreso extends Conexion
{

    public $table = 'egreso';

    public function __construct()
    {
        parent::__construct($this->table);
    }

    public function all(array $data = null)
    {
        if (empty($data)) {
            $hoy = date("Y-m-d");
            $sql = "SELECT id, nombre, descripcion, total, created_at AS fecha FROM {$this->table} WHERE DATE(created_at) = '{$hoy}';";
            $stm = $this->query($sql);
            return $stm->fetchAll(\PDO::FETCH_OBJ);
        } else {
            return $this->getAll();
        }
        
    }

    public function save($data)
    {
        $sql = "INSERT INTO {$this->table} (nombre, descripcion, total, created_at, updated_at) VALUES (?, ?, ?, ?, ?);";
        $stm = $this->prepare($sql);
        $hoy = date("Y-m-d H:i:s");
        $stm->bindValue(1, $data['nombre']);
        $stm->bindValue(2, $data['descripcion']);
        $stm->bindValue(3, $data['monto']);
        $stm->bindValue(4, $hoy);
        $stm->bindValue(5, $hoy);
        return $stm->execute();

        $stm = null;

    }

    public function update($data)
    {
        $sql = "UPDATE {$this->table} SET nombre = ?, descripcion = ?, total = ?, updated_at = ? WHERE id = ?;";
        $stm = $this->prepare($sql);
        $hoy = date("Y-m-d H:i:s");
        $stm->bindValue(1, $data['nombre']);
        $stm->bindValue(2, $data['descripcion']);
        $stm->bindValue(3, $data['monto']);
        $stm->bindValue(4, $hoy);
        $stm->bindValue(5, $data['codigo']);
        return $stm->execute();

        $stm = null;

    }

    public function get($id) 
    {
        return $this->getById($id);
    }

    public function count()
    {
        $hoy = date("Y-m-d"); 
        $sql = "SELECT COUNT(id) AS cantidad, SUM(total) AS total FROM {$this->table} WHERE DATE(created_at) = '{$hoy}';";
        $stm = $this->query($sql);
        return $stm->fetch(\PDO::FETCH_OBJ);
    }

    public function delete(int $id)
    {
        return $this->deleteById($id);
    }


}
