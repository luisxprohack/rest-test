<?php

namespace App\Model;

use Core\Conexion;

class Mesa extends Conexion
{

    public $table = 'mesa';

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
        $sql = "INSERT INTO {$this->table} (nombre) VALUES (?);";
        $stm = $this->prepare($sql);

        $stm->bindValue(1, $data['nombre']);
        return $stm->execute();

        $stm = null;

    }

    public function update($data)
    {
        $sql = "UPDATE {$this->table} SET nombre = ? WHERE id = ?;";
        $stm = $this->prepare($sql);

        $stm->bindValue(1, $data['nombre']);
        $stm->bindValue(2, $data['codigo']);
        return $stm->execute();

        $stm = null;

    }

    public function get($id) 
    {
        return $this->getById($id);
    }


}
