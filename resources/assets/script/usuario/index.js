(function($) {

    function rol(id) {
        switch (id) {
            case 1:
                return 'Administrador';
            case 2:
                return 'Moso';
            case 3:
                return 'Cocinero';
        }
    }

    table = $('#table-data').DataTable({
        language: {
            url: url_base + "resources/assets/json/Spanish.json"
        },
        destroy: true,
        ajax: {
            type: 'POST',
            url: url_base + 'usuario/show',
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
            { data: 'empleado' },
            { data: 'email' },
            {
                data: 'rol',
                render: function(data, type, row) {
                    return rol(parseInt(row.rol));
                }
            },
            {
                data: 'estado',
                render: function(data, type, row) {
                    return row.estado == 1 ? `<input type='button' data-id='${row.id}' class='btn btn-success btn-sm btnEstado' value='Activado'>` : `<input type='button' data-id='${row.id}' class='btn btn-danger btn-sm btnEstado' value='Desactivado'>`;
                }
            },
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
            url: url_base + 'usuario/' + id + '/edit',
            type: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $.ajaxblock();
            },
            success: function(response) {
                $.ajaxunblock();
                if (response) {
                    $('#codigo').val(response.id);
                    $('#email').val(response.email);
                    //$('#pass').val(response.pass);
                    $('#empleado').val(response.empleado_id);
                    $('#rol').val(response.rol);
                    $formAjax.attr("action", url_base + 'usuario/update');
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
        $formAjax.attr("action", url_base + 'usuario/store');
        $formAjax.trigger('reset');
    });

    $document.on('click', 'input.btnEditar', function(e) {
        let id = $(this).data("id");
        getData(id);
    });

    function estado_ajax(id) {
        $.ajax({
            url: url_base + 'usuario/update/estado',
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


    $document.on('click', 'input.btnEstado', function(e) {
        let id = $(this).data("id");
        swal({
                title: `Desea cambiar el estado del usuario CODIGO-${id}?`,
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