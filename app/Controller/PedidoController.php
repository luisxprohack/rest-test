<?php


namespace App\Controller;

use App\Evento\MesaEvento;
use App\Helper\ResponseHelper;
use App\Model\Bebida;
use App\Model\Cliente;
use App\Model\Mesa;
use App\Model\Pedido;
use App\Model\Plato;
use Core\Template;
use App\Helper\ReporteHelper;

class PedidoController extends Template
{

    use ResponseHelper, ReporteHelper;

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {

        $titulo = "Pedido";

        $mesas = (new Mesa)->all();

        $platos = (new Plato)->lista();

        $bebidas = (new Bebida)->lista();

        $clientes = (new Cliente)->all();

        $lista = array_merge($platos, $bebidas);

        return $this->render('pedido/index.twig', compact('titulo', 'mesas', 'lista', 'clientes', 'bebidas'));
    }

    public function view_cocina()
    {
        $titulo = "Cocina";
        $platos = (new Plato)->lista();
        $bebidas = (new Bebida)->lista();
        $clientes = (new Cliente)->all();
        $lista = array_merge($platos, $bebidas);
        (new Pedido)->updateNoti();
        $mesas = (new Pedido())->all(["estado" => 0]);
        return $this->render('pedido/cocina.twig', compact('titulo', 'mesas', 'clientes', 'lista'));
    }

    public function view_diario()
    {
        $titulo = "Pedido Diario";
        $platos = (new Plato)->lista();
        $bebidas = (new Bebida)->lista();
        $clientes = (new Cliente)->all();
        $lista = array_merge($platos, $bebidas);
        return $this->render('pedido/diario.twig', compact('titulo', 'clientes', 'lista'));
    }

    public function view_total()
    {
        $titulo = "Pedido Total";
        return $this->render('pedido/total.twig', compact('titulo'));
    }

    public function edit($id)
    {
        $data = (new Pedido())->get($id);
        return $this->json($data);
    }

    public function getPdf(int $id)
    {
        $data = (new Pedido)->getDetalle($id);
        return $this->generar_pdf($data);
    }

    public function store()
    {
        $data = $_POST;
        $empleado = \App\Middleware\AuthMiddleware::getData();
        //(new MesaEvento)->estado($data);
        $rpta = (new Pedido())->save($data, $empleado->id);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se guardo correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se guardo el registro.'));
        }
    }

    public function storeBebida()
    {
        $input = $_POST;
        if (empty($input["lista"])) {
            return $this->json($this->setResponse(false, 'Seleccione al menos un pedido.'));
        }
        $empleado = \App\Middleware\AuthMiddleware::getData();
        $rpta = (new Pedido())->saveBebida($input, $empleado->id);
        if ($rpta) {
            $this->href = "self";
            return $this->json($this->setResponse(true, 'Se guardo correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se guardo el registro.'));
        }
    }

    public function update()
    {
        $input = $_POST;
        if (!isset($input["producto"])) {
            return $this->json($this->setResponse(false, 'Seleccione al menos un pedido.'));
        }
        $pedidos = array();
        $total = 0.00;
        foreach ($input["producto"] as $key => $value) {
            $pedido = json_decode($value, true);
            $pedido["nota"] = "";
            $pedidos[] = $pedido;
            $total += $pedido["total"];
        }
        $data = array();
        $data["detalle"] = json_encode($pedidos);
        $data["estado"] = $input["estado"];
        $data["total"] = number_format($total, 2);
        $data["codigo"] = $input["codigo"];
        $rpta = (new Pedido())->update($data);
        if ($rpta) {
            $this->href = "self";
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se guardo el registro.'));
        }
    }

    public function updateCocina()
    {
        $input = $_POST;
       
        if (empty(json_decode($input["lista"], true))) {
            return $this->json($this->setResponse(false, 'Seleccione al menos un pedido.'));
        }
        
        $pedidos = array();
        $total = 0.00;
        foreach (json_decode($input["lista"], true) as $key) {
            $pedidos[] = $key;
            $total += $key["total"];
        }
        $data = array();
        $data["detalle"] = json_encode($pedidos);
        $data["persona"] = $input["persona"];
        $data["cliente"] = $input["cliente"];
        $data["nota"] = $input["nota"];
        $data["total"] = number_format($total, 2);
        $data["codigo"] = $input["codigo"];
        $rpta = (new Pedido())->updateCocina($data);
        if ($rpta) {
            $this->href = "self";
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se guardo el registro.'));
        }
    }

    public function show()
    {
        $input = $_POST;
        $data = (new Pedido())->all($input);
        $data = array(
            "sEcho" => 1,
            "iTotalRecords" => count($data),
            "iTotalDisplayRecords" => count($data),
            "data" => $data
        );
        return $this->json($data);
    }

    public function updateEstado()
    {
        $data = $_POST;
        $rpta = (new Pedido())->updateEstado($data);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se modifico el registro.'));
        }
    }

    public function updatePagado()
    {
        $data = $_POST['id'];
        $rpta = (new Pedido())->updatePagado($data);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se modifico el registro.'));
        }
    }

    public function eventoEstado()
    {    
        $datos = $_POST;
        return (new MesaEvento)->estado($datos);
    }

    public function notificacionCocina()
    {
        (new Pedido)->updateNoti();
        $data = (new Pedido())->all(["estado" => 0]);
        return $this->json($data);
    }

    public function countNoti()
    {
        $data = (new Pedido())->count_noti();
        return $this->json($data);
    }


}