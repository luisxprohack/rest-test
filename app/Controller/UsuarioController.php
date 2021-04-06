<?php

namespace App\Controller;

use App\Helper\ResponseHelper;
use App\Model\{Usuario, Empleado};
use Core\Template;

class UsuarioController extends Template
{

    use ResponseHelper;

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {

        $titulo = "Usuario";
        $empleados = (new Empleado)->all();

        return $this->render('usuario/index.twig', compact('titulo', 'empleados'));
    }

    public function show()
    {
        $data = (new Usuario())->all();
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
        $rpta = (new Usuario())->save($data);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se guardo correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se guardo el registro.'));
        }
       
    }

    public function edit($id)
    {
        $data = (new Usuario())->get($id);
        return $this->json($data);
    }

    public function updateEstado()
    {
        $data = $_POST['id'];
        $rpta = (new Usuario())->updateEstado($data);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se modifico el registro.'));
        }
    }

    public function update()
    {
        $data = $_POST;
        $rpta = (new Usuario())->update($data);
        if ($rpta) {
            $this->modal = true;
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se modifico el registro.'));
        }
    }

}