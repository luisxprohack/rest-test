<?php

namespace App\Middleware;
use Core\Session;

class AuthMiddleware
{

    public static function isLogged(): bool
    {
        $session = new Session();
        $session = $session->segment('App\Controller\AuthController');
        $usuario = $session->get('usuario');
        return !empty($usuario) ? false : true;
    }

    public static function getData()
    {
        $session = new Session();
        $session = $session->segment('App\Controller\AuthController');
        $usuario = $session->get('usuario');
        if (!empty($usuario)) {
            return $usuario;
        }
    }
}
