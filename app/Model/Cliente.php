<?php

namespace App\Model;

use Core\Conexion;

class Cliente extends Conexion
{

    public $table = 'cliente';

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
        $sql = "INSERT INTO {$this->table} (nombre, direccion, celular, created_at) VALUES (?, ?, ?, ?);";
        $conexion = $this->conectar();
        $stm = $conexion->prepare($sql);
        $hoy = date("Y-m-d H:i:s"); 
        $stm->bindValue(1, $data['nombre']);
        $stm->bindValue(2, $data['direccion']);
        $stm->bindValue(3, $data['celular']);
        $stm->bindValue(4, $hoy);
        return $stm->execute();
        $stm = null;
    }

    public function update($data)
    {
        $sql = "UPDATE {$this->table} SET nombre = ?, direccion = ?, celular = ? WHERE id = ?;";
        $stm = $this->prepare($sql);
        $hoy = date("Y-m-d H:i:s");
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

}
