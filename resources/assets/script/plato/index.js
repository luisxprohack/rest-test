(function($) {

    table = $('#table-data').DataTable({
        language: {
            url: url_base + "resources/assets/json/Spanish.json"
        },
        destroy: true,
        ajax: {
            type: 'POST',
            url: url_base + 'plato/show',
            dataType: 'json',
            error: function(e) {
                console.error(e.responseText);
            }
        },
        pageLength: 10,
        columnDefs: [{
            targets: 6,
            orderable: false
        }],
        columns: [
            { data: 'id' },
            { data: 'nombre' },
            { data: 'precio' },
            {
                data: 'imagen',
                render: function(data, type, row) {
                    return `<div>
                    <a href="#" class="thumbnail">
                      <img src="${url_base +'storage/image/platos/'+ row.imagen}" alt="${row.nombre}" width="80px" height="100px">
                    </a>
                  </div>`;
                }
            },
            { data: 'descripcion' },
            { data: 'tipo_plato_id' },
            {
                data: 'estado',
                render: function(data, type, row) {
                    return row.estado == 1 ? `<span class="btn btn-success">Activado</span>` : `<span class="btn btn-danger">Desactivado</span>`;
                }
            },
            {
                data: 'id',
                render: function(data, type, row) {
                    return `<input type='button' data-id='${row.id}' class='btn btn-warning btn-sm btnEditar' value='Editar'> <input type='button' data-id='${row.id}' class='btn btn-default btn-sm btnEstado' value='Estado'>`;
                }
            }
        ]
    });

    //Metodo para solicitar data
    function getData(id) {
        $.ajax({
            url: url_base + 'plato/' + id + '/edit',
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
                    $('#precio').val(response.precio);
                    $('#descripcion').val(response.descripcion);
                    $('#tipo').val(response.tipo_plato_id);
                    $formAjax.attr("action", url_base + 'plato/update');
                    $modal.modal('show')
                } else {
                    respuesta_servidor(3, 'No se encontro el registro que solicito.');
                }
            },
            error: controlar_error
        });
    }

    function estado_ajax(id) {
        $.ajax({
            url: url_base + 'plato/update/estado',
            type: 'post',
            data: { id },
            dataType: "json",
            beforeSend: function() {
                $.ajaxblock();
            },
            success: function(response) {

                $.ajaxunblock();

                if (response.response) {

                    table.ajax.reload();
                    respuesta_servidor(1, response.message);

                } else {
                    respuesta_servidor(2, response.message);
                }

            },
            error: controlar_error
        });
    }

    $modal.on('hidden.bs.modal', function(e) {
        $(":input.is-invalid").removeClass('is-invalid');
        $(".error.invalid-feedback").remove();
        $('#codigo').val('0');
        $formAjax.attr("action", url_base + 'plato/store');
        $formAjax.trigger('reset');
    });

    $document.on('click', 'input.btnEditar', function(e) {
        let id = $(this).data("id");
        getData(id);
    });


    $document.on('click', 'input.btnEstado', function(e) {
        let id = $(this).data("id");
        swal({
                title: `Desea cambiar el estado del plato CODIGO-${id}?`,
                text: "Presiona OK, para continuar.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    estado_ajax(id);
                }
            });
    });

})(jQuery);