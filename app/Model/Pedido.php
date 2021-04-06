<?php

namespace App\Model;

use Core\Conexion;
use App\Helper\Functions;

class Pedido extends Conexion
{

    public $table = 'pedido';
    use Functions;

    public function __construct()
    {
        parent::__construct($this->table);
    }

    public function all(array $data = null)
    {
        if (!empty($data)) {
            $estado = (int) $data['estado'];
            $hoy = date("Y-m-d");
            $sql = "SELECT 
            a.id, b.nombre AS mesa, c.nombre AS cliente, a.cant_personas, a.pagado, a.estado, a.total, a.detalle, a.nota 
        FROM {$this->table} a 
        INNER JOIN mesa b ON a.mesa_id = b.id 
        INNER JOIN cliente c ON a.cliente_id = c.id 
        WHERE a.estado = {$estado} AND DATE(a.created_at) = '{$hoy}';";
        } else {
            $sql = "SELECT 
            a.id, b.nombre AS mesa, c.nombre AS cliente, a.cant_personas, a.pagado, a.estado, a.total, d.nombre AS empleado, a.created_at AS fecha, a.detalle, a.nota  
        FROM {$this->table} a 
        INNER JOIN mesa b ON a.mesa_id = b.id 
        INNER JOIN cliente c ON a.cliente_id = c.id
        INNER JOIN empleado d ON a.empleado_id = d.id;";
        }

        $stm = $this->query($sql);
        return $stm->fetchAll(\PDO::FETCH_OBJ);
        //return $this->getAll();
    }

    public function save($data, $empleado)
    {
        $sql = "INSERT INTO {$this->table} (mesa_id, empleado_id, cliente_id, cant_personas, nota, detalle, pagado, estado, total, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        $conexion = $this->conectar();
        $stm = $conexion->prepare($sql);
        $hoy = date("Y-m-d H:i:s");
        $stm->bindValue(1, $data['mesa']);
        $stm->bindValue(2, $empleado);
        $stm->bindValue(3, $data['cliente']);
        $stm->bindValue(4, $data['persona']);
        $stm->bindValue(5, $data['nota']);
        $stm->bindValue(6, $data['detalle']);
        $stm->bindValue(7, 0);
        $stm->bindValue(8, 0);
        $stm->bindValue(9, $data['total']);
        $stm->bindValue(10, $hoy);
        $stm->bindValue(11, $hoy);
        return $stm->execute();
        $stm = null;
    }

    public function saveBebida($data, $empleado)
    {
        $sql = "INSERT INTO {$this->table} (mesa_id, empleado_id, cliente_id, cant_personas, nota, detalle, pagado, estado, total, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        $conexion = $this->conectar();
        $stm = $conexion->prepare($sql);
        $hoy = date("Y-m-d H:i:s");
        $stm->bindValue(1, 1);
        $stm->bindValue(2, $empleado);
        $stm->bindValue(3, $data['cliente']);
        $stm->bindValue(4, 1);
        $stm->bindValue(5, "Compra de bebida.");
        $stm->bindValue(6, $data['lista']);
        $stm->bindValue(7, 0);
        $stm->bindValue(8, 1);
        $stm->bindValue(9, $data['total']);
        $stm->bindValue(10, $hoy);
        $stm->bindValue(11, $hoy);
        return $stm->execute();
        $stm = null;
    }

    public function update($data)
    {
        $sql = "UPDATE {$this->table} SET detalle = ?, estado = ?, total = ?, updated_at = ? WHERE id = ?;";
        $stm = $this->prepare($sql);
        $hoy = date("Y-m-d H:i:s");
        $stm->bindValue(1, $data['detalle']);
        $stm->bindValue(2, $data['estado']);
        $stm->bindValue(3, $data['total']);
        $stm->bindValue(4, $hoy);
        $stm->bindValue(5, $data['codigo']);
        return $stm->execute();
        $stm = null;
    }

    public function updateCocina($data)
    {
        $sql = "UPDATE {$this->table} SET estado = 0, cliente_id = ?, cant_personas = ?, detalle = ?, total = ?, nota = ?, updated_at = ? WHERE id = ?;";
        $stm = $this->prepare($sql);
        $hoy = date("Y-m-d H:i:s");
        $stm->bindValue(1, $data['cliente']);
        $stm->bindValue(2, $data['persona']);
        $stm->bindValue(3, $data['detalle']);
        $stm->bindValue(4, $data['total']);
        $stm->bindValue(5, $data['nota']);
        $stm->bindValue(6, $hoy);
        $stm->bindValue(7, $data['codigo']);
        return $stm->execute();
        $stm = null;
    }

    public function get($id)
    {
        return $this->getById($id);
    }

    public function getDetalle(int $id = 0)
    {
        $sql = "SELECT 
            a.id, b.nombre AS mesa, c.nombre AS cliente, c.direccion, c.celular, a.cant_personas, a.pagado, a.estado, a.total, a.detalle 
        FROM {$this->table} a 
        INNER JOIN mesa b ON a.mesa_id = b.id 
        INNER JOIN cliente c ON a.cliente_id = c.id 
        WHERE a.id = {$id};";
        $stm = $this->query($sql);
        return $stm->fetch(\PDO::FETCH_OBJ);
    }

    public function updateEstado($data)
    {
        $hoy = date("Y-m-d H:i:s");
        $id = $data["id"];
        if (!isset($data["estado"])) {
            $query = $this->query("SELECT estado FROM {$this->table} WHERE id = {$id};");
            $estado = $query->fetch(\PDO::FETCH_OBJ);
            $estado =  $this->val_estado($estado->estado);
        } else {
            $estado = $data["estado"];
        }
        $sql = "UPDATE {$this->table} SET estado = ?, updated_at = ? WHERE id = ?;";
        $stm = $this->prepare($sql);
        $stm->bindValue(1, $estado);
        $stm->bindValue(2, $hoy);
        $stm->bindValue(3, $id);
        return $stm->execute();
    }

    public function updatePagado($id)
    {
        $hoy = date("Y-m-d H:i:s");
        $query = $this->query("SELECT pagado FROM {$this->table} WHERE id = {$id};");
        $pagado = $query->fetch(\PDO::FETCH_OBJ);
        $pagado =  $pagado->pagado == 1 ? 0 : 1;
        $sql = "UPDATE {$this->table} SET pagado = ?, updated_at = ? WHERE id = ?;";
        $stm = $this->prepare($sql);
        $stm->bindValue(1, $pagado);
        $stm->bindValue(2, $hoy);
        $stm->bindValue(3, $id);
        return $stm->execute();
    }

    public function count()
    {
        $hoy = date("Y-m-d"); 
        $sql = "SELECT COUNT(id) AS cantidad, SUM(total) AS total FROM {$this->table} WHERE DATE(created_at) = '{$hoy}' AND estado = 1 AND pagado = 1;";
        $stm = $this->query($sql);
        return $stm->fetch(\PDO::FETCH_OBJ);
    }

    public function count_noti()
    {
        $hoy = date("Y-m-d"); 
        $sql = "SELECT COUNT(id) AS cantidad FROM {$this->table} WHERE DATE(created_at) = '{$hoy}' AND noti = 0;";
        $stm = $this->query($sql);
        return $stm->fetch(\PDO::FETCH_OBJ);
    }

    public function updateNoti()
    {
        $hoy = date("Y-m-d"); 
        $sql = "UPDATE {$this->table} SET noti = 1 WHERE DATE(created_at) = '{$hoy}' AND noti = 0;";
        return $this->query($sql);
    }

}
