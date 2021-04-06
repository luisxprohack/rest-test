<?php

namespace Core;
use Pusher\Pusher as Socket;

abstract class Pusher
{ 
    protected $pusher;

    public function __construct()
    {
        $options = array(
            'cluster' => 'us2',
            'useTLS' => false,
            'host' => "127.0.0.1",
            'port' => 6001,
          );
        
        $this->pusher = new Socket(
            "key-1", 
            "secret-1", 
            1, 
            $options
        );
    }
}
