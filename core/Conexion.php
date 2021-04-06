<?php

namespace Core;
use PDO;
use PDOException;

abstract class Conexion
{
    private $driver, $host, $user, $pass, $database, $conexion;

    protected $table;

    public function __construct(string $table)
    {
        $this->table = $table;
        $this->driver = DB_CONNECTION;
        $this->host = DB_HOST;
        $this->user = DB_USERNAME;
        $this->pass = DB_PASSWORD;
        $this->database = DB_DATABASE;
    }

    protected function conectar()
    {
        try {
            $this->conexion = new PDO("{$this->driver}:host={$this->host};dbname={$this->database}",$this->user,$this->pass);
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conexion->exec("SET NAMES 'utf8'");
            return $this->conexion;
        } catch (PDOException $ex) {
            die('Falló la conexión: ' . $ex->getMessage());
        }

    }

    protected function prepare($sql){
		return $this->conectar()->prepare($sql);
    }
    
    protected function getAll()
    {
        $stm = $this->conectar()->prepare("SELECT * FROM {$this->table};");
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_OBJ);
        $stm = null;
    }

    protected function getById($id)
    {
        $stm = $this->conectar()->prepare("SELECT * FROM {$this->table} WHERE id = :id LIMIT 1;");
        $stm->bindParam(":id", $id, PDO::PARAM_INT);
        $stm->execute();
        return $stm->fetch(PDO::FETCH_OBJ);
        $stm = null;
    }

    protected function getPrepare($columna, $value)
    {
        $stm = $this->conectar()->prepare("SELECT * FROM {$this->table} WHERE $columna = :val LIMIT 1;");
        $stm->bindParam(":val", $value);
        $stm->execute();
        return $stm->fetch(PDO::FETCH_OBJ);
        $stm = null;
    }

    protected function deleteById($id)
    {
        $stm = $this->conectar()->prepare("DELETE FROM {$this->table} WHERE id = :id LIMIT 1;");
        $stm->bindParam(":id", $id, PDO::PARAM_INT);
        return $stm->execute();
        $stm = null;
    }

    protected function deletePrepare($columna, $value)
    {
        $stm = $this->conectar()->prepare("DELETE FROM {$this->table} WHERE $columna = :val LIMIT 1;");
        $stm->bindParam(":val", $value);
        return $stm->execute();
        $stm = null;
    }

    protected function lastInsertId()
	{
		return $this->conectar()->lastInsertId();
	}

    protected function query($sql)
    {
        return $this->conectar()->query($sql);
    }

}