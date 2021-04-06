<?php


namespace Core;

class Template
{
    protected $provider;

    public function __construct() {

        $loader = new \Twig\Loader\FilesystemLoader( _BASE_PATH_.'/resources/views/');

        $this->provider = new \Twig\Environment($loader, array(
            'cache' => false,
            'debug' => APP_DEBUG,
        ));

        $this->provider->addExtension(new \Twig\Extension\DebugExtension());

        // Filtros
        $this->addCustomFilters();
    }

    private function addCustomFilters(){
        // Funciones
        $this->provider->addFunction(new \Twig\TwigFunction('urlBase', ['App\\Helper\\UrlHelper', 'base']));
        $this->provider->addFunction(new \Twig\TwigFunction('resources', ['App\\Helper\\UrlHelper', 'resources']));
        $this->provider->addFunction(new \Twig\TwigFunction('nombreApp', function(string $nombre = null){
            return $nombre != "" ? strtoupper(_NOMBRE_APP_. " | {$nombre}") : strtoupper(_NOMBRE_APP_);
        }));
        $this->provider->addFunction(new \Twig\TwigFunction('auth', ['App\\Middleware\\AuthMiddleware', 'getData']));
        $this->provider->addFunction(new \Twig\TwigFunction('isAdmin', ['App\\Middleware\\RolMiddleware', 'isAdmin']));
        $this->provider->addFunction(new \Twig\TwigFunction('isMozo', ['App\\Middleware\\RolMiddleware', 'isMozo']));
        $this->provider->addFunction(new \Twig\TwigFunction('isCocinero', ['App\\Middleware\\RolMiddleware', 'isCocinero']));
        $this->provider->addFunction(new \Twig\TwigFunction('json_decode', function($json, $assoc = false){
            return json_decode($json, $assoc);
        }));
    }

    public function render(string $view, array $data = []) : string {
        return $this->provider->render($view, $data);
    }
}