<?php

namespace App\Helper;

trait ResponseHelper
{
    public $result      = null;
    public $response    = false;
    public $message     = 'Ocurrio un error inesperado.';
    public $validations = null;
    public $href        = null;
    public $modal       = false;

    public function setResponse($response, $m = '')
    {
        $this->response = $response;
        $this->message = $m;

        if (!$response && $m = '') {
            $this->response = 'Ocurrio un error inesperado.';
        }

        return $this;
    }

    public function setErrors($error)
    {
        $this->response = false;
        $this->validations = $error;
        $this->message = 'Corrige los siguientes errores.';
        return $this;
    }

    public function json($data) 
    {
        header("Content-Type: application/json");
        return json_encode($data);
    }


}
