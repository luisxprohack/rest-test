<?php

$router->filter('auth', function () {
    if (\App\Middleware\AuthMiddleware::isLogged()) {
        \App\Helper\UrlHelper::redirect('auth');
    }
});

$router->filter('login', function () {

    $session = new Core\Session();
    $session = $session->segment('App\Controller\AuthController');
    $usuario = $session->get('usuario');
    $message = $session->getFlash("message");
    $session->setFlash('message',  $message);
    if (!empty($usuario)) {
        \App\Helper\UrlHelper::redirect('inicio');
    } 
});

$router->filter('isAdmin', function(){
    if (!\App\Middleware\RolMiddleware::isAdmin()) {
        \App\Helper\UrlHelper::redirect("inicio");
    }
});
