<?php

namespace App\Evento;
use Core\Pusher;

class MesaEvento extends Pusher {

    public  function estado (array $datos) {
        return $this->pusher->trigger('mesa', 'MesaEstado', array('mesa' => $datos['mesa'], 'estado' => $datos['estado']));
    }

}