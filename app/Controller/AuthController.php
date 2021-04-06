<?php


namespace App\Controller;

use App\Model\Usuario;
use Core\Session;
use Core\Template;

class AuthController extends Template
{

    private $session;

    public function __construct()
    {
        parent::__construct();
        $this->session = new Session();
    }

    public function index()
    {
        $session = $this->session->segment('App\Controller\AuthController');
        $message = $session->getFlash("message");
        return $this->render('login/index.twig', [
            'titulo' => strtoupper('Iniciar Sesion'),
            'message' => $message
        ]);
    }

    public function iniciarSesion()
    {
        $session = $this->session->segment('App\Controller\AuthController');
        $email = $_POST['email'];
        $pass = $_POST['pass'];
        $data = (new Usuario)->validarEmail($email);
        if (!empty($data)) {
            if (password_verify($pass, $data->pass) && $data->estado == 1) {
                $this->session->getSession()->regenerateId();
                $session->set("usuario", $data);
                \App\Helper\UrlHelper::redirect('inicio');
            }
            $session->setFlash('message', 'Error al ingresar, vuelve a intentarlo.');
            \App\Helper\UrlHelper::redirect('auth');
        }
        $session->setFlash('message', 'Error al ingresar, vuelve a intentarlo.');
        \App\Helper\UrlHelper::redirect('auth');
    }

    public function salirSesion()
    {
        $this->session->getSession()->clear();
        $this->session->getSession()->destroy();
        \App\Helper\UrlHelper::redirect('auth');
    }
}
