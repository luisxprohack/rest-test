<?php

/* Hora local */
date_default_timezone_set("America/Lima");

/* Base url */
$base_url = '';
$base_folder = strtolower(str_replace(basename($_SERVER['SCRIPT_NAME']), '', $_SERVER['SCRIPT_NAME']));

if (isset($_SERVER['HTTP_HOST'])) {
    $base_url = isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off' ? 'https' : 'http';
    $base_url .= '://' . $_SERVER['HTTP_HOST'];
    $base_url .= $base_folder;
}

//Variables base
define('_BASE_HTTP_', $base_url);
define('_NOMBRE_APP_', 'La posada de Alonso');
define('_CURRENT_URI_', str_replace($base_folder, '', $_SERVER['REQUEST_URI']));
define('DB_CONNECTION', 'mysql');
define('DB_HOST', 'pdb22.runhosting.com');
define('DB_USERNAME', '3658628_restaurante');
define('DB_PASSWORD', '7xdRXXC#9f-rD0Fa');
define('DB_DATABASE', '3658628_restaurante');
define('APP_ENV', 'local');
define('APP_DEBUG', true);

if (APP_ENV === 'stop') {
    die('Aplicacion web en mantenimiento...');
}

if (APP_ENV === 'prod') {
    error_reporting(0);
}