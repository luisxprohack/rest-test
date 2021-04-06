<?php

$router->get('/', function () {
    \App\Helper\UrlHelper::redirect('auth');
});

//Authentiacion
$router->group(['before' => 'login'], function ($router) {

    $router->get('/auth', ['App\\Controller\\AuthController', 'index']);
    $router->post('/auth', ['App\\Controller\\AuthController', 'iniciarSesion']);

});

$router->group(['before' => 'auth'], function ($router) {

    $router->get('/auth/salir', ['App\\Controller\\AuthController', 'salirSesion']);

    //Inicio
    $router->get('/inicio', ['App\\Controller\\InicioController', 'index']);

    //Usuario
    $router->get('/usuario', ['App\\Controller\\UsuarioController', 'index'], ['before' => 'isAdmin']);
    $router->get('/usuario/{id}/edit', ['App\\Controller\\UsuarioController', 'edit'], ['before' => 'isAdmin']);

    $router->post('/usuario/show', ['App\\Controller\\UsuarioController', 'show']);
    $router->post('/usuario/store', ['App\\Controller\\UsuarioController', 'store']);
    $router->post('/usuario/update', ['App\\Controller\\UsuarioController', 'update']);
    $router->post('/usuario/update/estado', ['App\\Controller\\UsuarioController', 'updateEstado']);

    //Empleado
    $router->get('/empleado', ['App\\Controller\\EmpleadoController', 'index'], ['before' => 'isAdmin']);
    $router->get('/empleado/{id}/edit', ['App\\Controller\\EmpleadoController', 'edit']);

    $router->post('/empleado/show', ['App\\Controller\\EmpleadoController', 'show']);
    $router->post('/empleado/store', ['App\\Controller\\EmpleadoController', 'store']);
    $router->post('/empleado/update', ['App\\Controller\\EmpleadoController', 'update']);

    //Cliente
    $router->get('/cliente', ['App\\Controller\\ClienteController', 'index'], ['before' => 'isAdmin']);
    $router->get('/cliente/{id}/edit', ['App\\Controller\\ClienteController', 'edit']);

    $router->post('/cliente/show', ['App\\Controller\\ClienteController', 'show']);
    $router->post('/cliente/store', ['App\\Controller\\ClienteController', 'store']);
    $router->post('/cliente/update', ['App\\Controller\\ClienteController', 'update']);

    //Mesa
    $router->get('/mesa', ['App\\Controller\\MesaController', 'index'], ['before' => 'isAdmin']);
    $router->get('/mesa/{id}/edit', ['App\\Controller\\MesaController', 'edit']);

    $router->post('/mesa/show', ['App\\Controller\\MesaController', 'show']);
    $router->post('/mesa/store', ['App\\Controller\\MesaController', 'store']);
    $router->post('/mesa/update', ['App\\Controller\\MesaController', 'update']);

    //Bebida
    $router->get('/bebida', ['App\\Controller\\BebidaController', 'index'], ['before' => 'isAdmin']);
    $router->get('/bebida/{id}/edit', ['App\\Controller\\BebidaController', 'edit']);

    $router->post('/bebida/show', ['App\\Controller\\BebidaController', 'show']);
    $router->post('/bebida/store', ['App\\Controller\\BebidaController', 'store']);
    $router->post('/bebida/update', ['App\\Controller\\BebidaController', 'update']);
    $router->post('/bebida/update/estado', ['App\\Controller\\BebidaController', 'updateEstado']);

    //Plato
    $router->get('/plato', ['App\\Controller\\PlatoController', 'index'], ['before' => 'isAdmin']);
    $router->get('/plato/{id}/edit', ['App\\Controller\\PlatoController', 'edit']);

    $router->post('/plato/show', ['App\\Controller\\PlatoController', 'show']);
    $router->post('/plato/store', ['App\\Controller\\PlatoController', 'store']);
    $router->post('/plato/update', ['App\\Controller\\PlatoController', 'update']);
    $router->post('/plato/update/estado', ['App\\Controller\\PlatoController', 'updateEstado']);

    //Pedido
    $router->get('/pedido', ['App\\Controller\\PedidoController', 'index']);
    $router->get('/pedido/cocina', ['App\\Controller\\PedidoController', 'view_cocina']);
    $router->get('/pedido/diario', ['App\\Controller\\PedidoController', 'view_diario'], ['before' => 'isAdmin']);
    $router->get('/pedido/total', ['App\\Controller\\PedidoController', 'view_total'], ['before' => 'isAdmin']);

    $router->get('/pedido/{id}/pdf', ['App\\Controller\\PedidoController', 'getPdf']);
    $router->get('/pedido/{id}/edit', ['App\\Controller\\PedidoController', 'edit']);
    $router->get('/pedido/notificacion/cocina', ['App\\Controller\\PedidoController', 'notificacionCocina']);
    $router->get('/pedido/notificacion/count', ['App\\Controller\\PedidoController', 'countNoti']);


    $router->post('/pedido/store', ['App\\Controller\\PedidoController', 'store']);
    $router->post('/pedido/store/bebida', ['App\\Controller\\PedidoController', 'storeBebida']);

    $router->post('/pedido/show', ['App\\Controller\\PedidoController', 'show']);
    $router->post('/pedido/update/estado', ['App\\Controller\\PedidoController', 'updateEstado']);
    $router->post('/pedido/update/pagado', ['App\\Controller\\PedidoController', 'updatePagado']);
    $router->post('/pedido/update', ['App\\Controller\\PedidoController', 'update']);
    $router->post('/pedido/update/cocina', ['App\\Controller\\PedidoController', 'updateCocina']);

    $router->post('/pedido/evento/estado', ['App\\Controller\\PedidoController', 'eventoEstado']);

    //Egreso
    $router->get('/egreso', ['App\\Controller\\EgresoController', 'index'], ['before' => 'isAdmin']);
    $router->get('/egreso/{id}/edit', ['App\\Controller\\EgresoController', 'edit']);

    $router->post('/egreso/show', ['App\\Controller\\EgresoController', 'show']);
    $router->post('/egreso/store', ['App\\Controller\\EgresoController', 'store']);
    $router->post('/egreso/update', ['App\\Controller\\EgresoController', 'update']);
    $router->post('/egreso/destroy', ['App\\Controller\\EgresoController', 'destroy']);
});
