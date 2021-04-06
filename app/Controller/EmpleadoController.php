<?php

namespace App\Controller;

use App\Helper\ResponseHelper;
use App\Model\Empleado;
use Core\Template;

class EmpleadoController extends Template
{

    use ResponseHelper;

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {

        $titulo = "Empleado";

        return $this->render('empleado/index.twig', compact('titulo'));
    }

    public function show()
    {
        $data = (new Empleado())->all();
        $data = array(
            "sEcho" => 1,
            "iTotalRecords" => count($data),
            "iTotalDisplayRecords" => count($data),
            "data" => $data
        );
        return $this->json($data);
    }

    public function store()
    {
        $data = $_POST;
        $rpta = (new Empleado())->save($data);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se guardo correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se guardo el registro.'));
        }
       
    }

    public function edit($id)
    {
        $data = (new Empleado())->get($id);
        return $this->json($data);
    }

    public function update()
    {
        $data = $_POST;
        $rpta = (new Empleado())->update($data);
        if ($rpta) {
            $this->modal = true;
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se modifico el registro.'));
        }
    }

}