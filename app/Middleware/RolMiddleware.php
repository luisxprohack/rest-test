<?php

namespace App\Middleware;
use App\Middleware\AuthMiddleware as Auth;

class RolMiddleware
{

    public static function isAdmin()
    {
        $user = Auth::getData();
        return $user->rol == 1;
    }

    public static function isMozo()
    {
        $user = Auth::getData();
        return $user->rol == 1 || $user->rol == 2;
    }

    public static function isCocinero()
    {
        $user = Auth::getData();
        return $user->rol == 1 || $user->rol == 3;
    }
}
