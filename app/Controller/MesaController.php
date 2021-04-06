<?php

namespace App\Controller;

use App\Helper\ResponseHelper;
use App\Model\Mesa;
use Core\Template;

class MesaController extends Template
{

    use ResponseHelper;

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {

        $titulo = "Mesa";

        return $this->render('mesa/index.twig', compact('titulo'));
    }

    public function show()
    {
        $data = (new Mesa())->all();
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
        $rpta = (new Mesa())->save($data);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se guardo correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se guardo el registro.'));
        }
       
    }

    public function edit($id)
    {
        $data = (new Mesa())->get($id);
        return $this->json($data);
    }

    public function update()
    {
        $data = $_POST;
        $rpta = (new Mesa())->update($data);
        if ($rpta) {
            $this->modal = true;
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se modifico el registro.'));
        }
    }

}