<?php

namespace App\Helper;

trait Functions {

    public function val_estado($val)
    {
        $estado = 0;
        switch ($val) {
            case 0:
                $estado = 1;
                break;
            case 1:
                $estado = 2;
                break;
            case 2:
                $estado = 0;
                break;
        }
        return $estado;
    }

}