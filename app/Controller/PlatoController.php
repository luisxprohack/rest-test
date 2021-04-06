<?php

namespace App\Controller;

use App\Helper\ResponseHelper;
use App\Model\Plato;
use Core\Template;

class PlatoController extends Template
{

    use ResponseHelper;

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {

        $titulo = "Plato / Comida";

        $tipos = (new Plato)->tipos();

        return $this->render('plato/index.twig', compact('titulo', 'tipos'));
    }

    public function show()
    {
        $data = (new Plato())->all();
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
        $rpta = (new Plato())->save($data, $_FILES['imagen']);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se guardo correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se guardo el registro.'));
        }
       
    }

    public function edit($id)
    {
        $data = (new Plato())->get($id);
        return $this->json($data);
    }

    public function update()
    {
        $data = $_POST;
        $rpta = (new Plato())->update($data, $_FILES['imagen']);
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
        $rpta = (new Plato())->updateEstado($data);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se modifico el registro.'));
        }
    }

}