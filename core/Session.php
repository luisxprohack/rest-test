<?php

namespace Core;

class Session
{

    private $session;

    public function __construct()
    {
        $session_factory = new \Aura\Session\SessionFactory;
        $this->session = $session_factory->newInstance($_COOKIE);

    }

    public function segment($nombre)
    {
        return $this->session->getSegment($nombre);
    }

    public function getSession()
    {
        return $this->session;
    }

}
