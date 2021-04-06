<?php

namespace App\Helper;

use Dompdf\Dompdf;

trait ReporteHelper
{

    public function generar_pdf($data)
    {
        $total = 0.00;

        $html = '
          <link rel="stylesheet" href="' . _BASE_HTTP_ . 'resources/assets/plugins/bootstrap/dist/css/bootstrap.min.css">
         <h1 style="text-align: center;"> Pedido </h1>

        <table>
		
		<tr>
			
			<td style="width:150px; height: 150px;"><img width="100px" src="' . _BASE_HTTP_ . 'resources/assets/img/icono.jpeg"></td>

			<td style="background-color:white; width:140px">
				
				<div text-align:right; line-height:15px;">
					
					<br>
                    Celular: 954 832 290

					<br>
					Dirección: Jr. Julio C. Delgado 239
					
					<br>
					Email: septay12@gmail.com

				</div>

			</td>


		</tr>

	</table>

	<table style="padding:5px 10px;">
	
		<tr>
		
			<td style="background-color:white; width:390px">
				Cliente: ' . $data->cliente . ' 
			</td>
			
			<td>
			    Direccion: ' . $data->direccion . '
            </td>
            
            <td>
                Celular: ' . $data->celular . ' 
            </td>

		</tr>

		<tr>
		

		</tr>

	</table>
	';

    $html .= ' <table class="table table-bordered" style="width: 100%;">
                                    <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>SubTotal</th>
                                    </tr>
                                    </thead>
                                    <tbody>';

        foreach (json_decode($data->detalle, true) as $item) {

            $total = $total + $item['total'];
            $html .= '<tr>
                    <td>' . $item['nombre'] . '</td>
                    <td>' . number_format($item['precio'], 2) . '</td>
                    <td>' . $item['cantidad'] . '</td>
                    <td>' . number_format($item['total'], 2) . '</td>
                    </tr>';
        }


        $html .= '</tbody>

        <tfoot>
            <tr>
                <th></th>
                <th></th>
                <th>Total</th>
                <th>'.number_format($total, 2).'</th>
            </tr>
        </tfoot>
                                </table>';


        $dompdf = new Dompdf(array('enable_remote' => true));
        $dompdf->loadHtml($html);

        // (Optional) Setup the paper size and orientation
        $dompdf->setPaper('A4', 'landscape');

        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF to Browser
        return $dompdf->stream("nro_venta_" . $data->id . ".pdf", array("Attachment" => 0));
    }
}
