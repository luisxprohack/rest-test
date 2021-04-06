<?php
/* Composer & PSR 4 */
require_once('vendor/autoload.php');

require_once("config/app.php");
define('_BASE_PATH_', __DIR__);

$router = new Phroute\Phroute\RouteCollector();

require_once('routes/filtros.php');
require_once('routes/web.php');

$dispatcher = new Phroute\Phroute\Dispatcher($router->getData());

try {

    $response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    die($response);

} catch (\Phroute\Phroute\Exception\HttpRouteNotFoundException $ex) {

    die('Error: Ruta no encontrada. ' . $ex->getMessage());

} catch (\Phroute\Phroute\Exception\HttpMethodNotAllowedException $ex) {

    die('Error: Ruta encontrada pero método no permitido.');

}

