<?php

namespace App\Model;

use Core\Conexion;

class Empleado extends Conexion
{

    public $table = 'empleado';

    public function __construct()
    {
        parent::__construct($this->table);
    }

    public function all()
    {
        return $this->getAll();
    }

    public function save($data)
    {
        $sql = "INSERT INTO {$this->table} (nombre, direccion, celular) VALUES (?, ?, ?);";
        $stm = $this->prepare($sql);

        $stm->bindValue(1, $data['nombre']);
        $stm->bindValue(2, $data['direccion']);
        $stm->bindValue(3, $data['celular']);
        return $stm->execute();

        $stm = null;

    }

    public function update($data)
    {
        $sql = "UPDATE {$this->table} SET nombre = ?, direccion = ?, celular = ? WHERE id = ?;";
        $stm = $this->prepare($sql);

        $stm->bindValue(1, $data['nombre']);
        $stm->bindValue(2, $data['direccion']);
        $stm->bindValue(3, $data['celular']);
        $stm->bindValue(4, $data['codigo']);
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
        $sql = "SELECT COUNT(id) AS cantidad FROM {$this->table};";
        $stm = $this->query($sql);
        return $stm->fetch(\PDO::FETCH_OBJ);
    }
    
}
