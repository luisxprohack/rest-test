<?php

namespace App\Controller;

use App\Helper\ResponseHelper;
use App\Model\Bebida;
use Core\Template;

class BebidaController extends Template
{

    use ResponseHelper;

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {

        $titulo = "Bebida";

        return $this->render('bebida/index.twig', compact('titulo'));
    }

    public function show()
    {
        $data = (new Bebida())->all();
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
        $rpta = (new Bebida())->save($data);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se guardo correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se guardo el registro.'));
        }
       
    }

    public function edit($id)
    {
        $data = (new Bebida())->get($id);
        return $this->json($data);
    }

    public function update()
    {
        $data = $_POST;
        $rpta = (new Bebida())->update($data);
        if ($rpta) {
            $this->modal = true;
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se modifico el registro.'));
        }
    }

    public function updateEstado()
    {
        $data = $_POST['id'];
        $rpta = (new Bebida())->updateEstado($data);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se modifico el registro.'));
        }
    }

}