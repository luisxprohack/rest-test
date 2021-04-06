<?php

namespace App\Controller;

use App\Helper\ResponseHelper;
use App\Model\Egreso;
use Core\Template;

class EgresoController extends Template
{

    use ResponseHelper;

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {

        $titulo = "Egreso";

        return $this->render('egreso/index.twig', compact('titulo'));
    }

    public function show()
    {
        $data = (new Egreso())->all();
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
        $input = $_POST;
        if (empty($input["nombre"])) {
            return $this->json($this->setResponse(false, 'Agrega un nombre.'));
        }
        if (empty($input["monto"])) {
            return $this->json($this->setResponse(false, 'Agrega el monto.'));
        }
        $rpta = (new Egreso())->save($input);
        if ($rpta) {
            $this->href = "self";
            return $this->json($this->setResponse(true, 'Se guardo correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se guardo el registro.'));
        }
       
    }

    public function edit($id)
    {
        $data = (new Egreso())->get($id);
        return $this->json($data);
    }

    public function update()
    {
        $data = $_POST;
        $rpta = (new Egreso())->update($data);
        if ($rpta) {
            $this->href = "self";
            return $this->json($this->setResponse(true, 'Se modifico correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se modifico el registro.'));
        }
    }

    public function destroy()
    {
        $input = $_POST;
        $rpta = (new Egreso())->delete($input['id']);
        if ($rpta) {
            return $this->json($this->setResponse(true, 'Se elimino correctamente el registro.'));
        } else {
            return $this->json($this->setResponse(false, 'No se pudo eliminar el registro.'));
        }
    }

}