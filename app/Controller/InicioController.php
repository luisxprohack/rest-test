<?php


namespace App\Controller;

use App\Model\Pedido;
use App\Model\Plato;
use App\Model\Empleado;
use App\Model\Egreso;
use Core\Template;

class InicioController extends Template
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {

        $titulo = "Resumen";

        $pedido = (new Pedido)->count();

        $pedido->total = number_format($pedido->total, 2);

        $plato = (new Plato)->count();

        $empleado = (new Empleado)->count();

        $egreso = (new Egreso)->count();

        $egreso->total = number_format($egreso->total, 2);

        $ganancia = ((float) $pedido->total - (float) $egreso->total);

        $ganancia = number_format($ganancia, 2);

        return $this->render('inicio/index.twig', compact("titulo", "pedido", "plato", "empleado", "egreso", "ganancia"));
    }
}