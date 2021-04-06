var url_base = $('meta[name="url-base"]').attr('content');
// Vue.prototype.$urlBase = $('meta[name="url-base"]').attr('content');
const $formAjax = $(".formAjax");
const $document = $(document);
const $modal = $('.modal');
var table;

$(document).ready(function() {
    $('.sidebar-menu').tree()
});

$formAjax.on("submit", function(e) {

    e.preventDefault();
    let $this = $(this);
    let url = $this.attr("action");
    let method = $this.attr("method");
    let data = new FormData($this[0]);
    ajax(url, method, data, $this);

});

function ajax(url, method, data, elem) {
    $.ajax({
        url: url,
        type: method,
        data: data,
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function() {
            $.ajaxblock();
        },
        success: function(response) {
            $.ajaxunblock();

            //Mostrar respuesta
            if (response.response) {

                if (typeof table !== undefined) {
                    if (table) {
                        table.ajax.reload();
                    }
                }

                elem[0].reset();
                respuesta_servidor(1, response.message);
            } else {
                respuesta_servidor(2, response.message);
            }

            if (response.modal) {
                $modal.modal("hide");
            }

            //Mostrar si hay validaciones
            if (response.validations) {

            }

            // Redireccionar
            if (response.href !== null) {
                if (response.href === 'self') window.location.reload();
                else window.location.href = response.href;
            }

        },
        error: controlar_error
    });
}

function respuesta_servidor(tipo, mensaje) {
    switch (tipo) {
        case 1:
            return swal("Aviso", mensaje, "success");
            //break;
        case 2:
            return swal("Aviso", mensaje, "error");
            //break;
        case 3:
            return swal("Aviso", mensaje, "warning");
            //break;
        case 4:
            return swal("Aviso", mensaje, "info");
            //break;
    }
}


$.ajaxblock = function() {
    $("body").prepend("<div id='ajax-overlay'><div id='ajax-overlay-body' class='center'><i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i><span class='sr-only'>Cargando...</span></div></div>");
    $("#ajax-overlay").css({
        position: 'absolute',
        color: '#FFFFFF',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        position: 'fixed',
        background: 'rgba(39, 38, 46, 0.67)',
        'text-align': 'center',
        'z-index': '9999'
    });

    $("#ajax-overlay-body").css({
        position: 'absolute',
        top: '40%',
        left: '50%',
        width: '120px',
        height: '48px',
        'margin-top': '-12px',
        'margin-left': '-60px',
        //background: 'rgba(39, 38, 46, 0.1)',
        '-webkit-border-radius': '10px',
        '-moz-border-radius': '10px',
        'border-radius': '10px'
    });
    $("#ajax-overlay").fadeIn(50);
};

function controlar_error(jqXHR, textStatus, errorThrown) {

    $.ajaxunblock();

    let respuestaError = '';

    if (jqXHR.status === 0) {

        respuestaError = 'No conexion: Verficar la red.';

    } else if (jqXHR.status == 404) {

        respuestaError = 'Página solicitada no encontrada [404]';

    } else if (jqXHR.status == 500) {

        respuestaError = 'Error de servidor interno [500].';

    } else if (textStatus === 'parsererror') {

        respuestaError = 'EL JSON solicitado fallo.';

    } else if (textStatus === 'timeout') {

        respuestaError = 'Error de tiempo de espera falló.';

    } else if (textStatus === 'abort') {

        respuestaError = 'Peticion cancelada.';

    } else {

        respuestaError = 'Error no detectado: ' + jqXHR.responseText;

    }
    respuesta_servidor(2, respuestaError);
}

$.ajaxunblock = function() {
    $("#ajax-overlay").fadeOut(100, function() {
        $("#ajax-overlay").remove();
    });
};

function VentanaCentrada(theURL, winName, features, myWidth, myHeight, isCenter) {
    if (window.screen)
        if (isCenter)
            if (isCenter == "true") {
                var myLeft = (screen.width - myWidth) / 2;
                var myTop = (screen.height - myHeight) / 2;
                features += (features != '') ? ',' : '';
                features += ',left=' + myLeft + ',top=' + myTop;
            }
    window.open(theURL, winName, features + ((features != '') ? ',' : '') + 'width=' + myWidth + ',height=' + myHeight);
}

function imprimir_detalle(id) {
    VentanaCentrada(url_base + 'pedido/' + id + '/pdf', 'Detalle Pedido', '', '1024', '768', 'true');
}

function input_detalle(data) {
    return `<input type='button' data-id='${data.id}' class='btn btn-danger btn-sm btnPdf' value='PDF'> 
    <input type='button' data-id='${data.id}' class='btn btn-primary btn-sm btnDetalle' data-nota='${data.nota}' data-detalle='${data.detalle}' value='Detalle'>
    <input type='button' data-id='${data.id}' class='btn btn-warning btn-sm btnEditar' value='Editar'>`;
}

function input_estado(data) {
    switch (data.estado) {
        case '0':
            return `<button type='button' class="btn btn-warning btnEstado" data-id='${data.id}'>Recibido</button>`;
        case '1':
            return `<button type='button' class="btn btn-success btnEstado" data-id='${data.id}'>Atendido</button>`;
        case '2':
            return `<button type='button' class="btn btn-danger btnEstado" data-id='${data.id}'>Cancelado</button>`;
    }
}


function input_pagado(data) {
    return data.pagado == 1 ? `<button type='button' class="btn btn-success btn-sm btnPagado" data-id='${data.id}'>Si</button>` : `<button type='button' class="btn btn-danger btn-sm btnPagado" data-id='${data.id}'>No</button>`;
}