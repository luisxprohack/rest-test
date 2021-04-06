(function($) {

    table = $('#table-data').DataTable({
        language: {
            url: url_base + "resources/assets/json/Spanish.json"
        },
        destroy: true,
        ajax: {
            type: 'POST',
            url: url_base + 'empleado/show',
            dataType: 'json',
            error: function(e) {
                console.error(e.responseText);
            }
        },
        pageLength: 10,
        columnDefs: [{
            targets: 4,
            orderable: false
        }],
        columns: [
            { data: 'id' },
            { data: 'nombre' },
            { data: 'direccion' },
            { data: 'celular' },
            {
                data: 'id',
                render: function(data, type, row) {
                    return `<input type='button' data-id='${row.id}' class='btn btn-warning btn-sm btnEditar' value='Editar'>`;
                }
            }
        ]
    });

    //Metodo para solicitar data
    function getData(id) {
        $.ajax({
            url: url_base + 'empleado/' + id + '/edit',
            type: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $.ajaxblock();
            },
            success: function(response) {
                $.ajaxunblock();
                if (response) {
                    $('#codigo').val(response.id);
                    $('#nombre').val(response.nombre);
                    $('#direccion').val(response.direccion);
                    $('#celular').val(response.celular);
                    $formAjax.attr("action", url_base + 'empleado/update');
                    $modal.modal('show')
                } else {
                    respuesta_servidor(3, 'No se encontro el registro que solicito.');
                }
            },
            error: controlar_error
        });
    }

    $modal.on('hidden.bs.modal', function(e) {
        $(":input.is-invalid").removeClass('is-invalid');
        $(".error.invalid-feedback").remove();
        $('#codigo').val('0');
        $formAjax.attr("action", url_base + 'empleado/store');
        $formAjax.trigger('reset');
    });

    $document.on('click', 'input.btnEditar', function(e) {
        let id = $(this).data("id");
        getData(id);
    });


    $document.on('click', 'input.btnEstado', function(e) {
        let id = $(this).data("id");
        swal({
                title: `Desea cambiar el estado del empleado CODIGO-${id}?`,
                text: "Presiona OK, para continuar.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    //estado_ajax(id);
                }
            });
    });

})(jQuery);