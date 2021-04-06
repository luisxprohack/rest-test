(function($) {

    var table_1 = $('#table-data1');
    var table_2 = $('#table-data2');
    var table_3 = $('#table-data3');
    var table_4 = $('#table-data4');

    const $cajaPedido = $("#cajaPedido");
    const $cajaEditar = $("#cajaEditar");
    const $listaPedido = $("#lista-pedido");
    const $btnRegresar = $("#btnRegresar");
    const $modalProducto = $("#modal-producto")
    const $modalEgreso = $("#modal-egreso");
    $('.select2').select2();
    var lista = [];

    const $btnAgregarEtiqueta = $('#btnAgregarEtiqueta');

    function inicializar_table() {

        //Table 1
        table_1 = $('#table-data1').DataTable({
            language: {
                url: url_base + "resources/assets/json/Spanish.json"
            },
            destroy: true,
            scrollX: true,
            ajax: {
                type: 'POST',
                url: url_base + 'pedido/show',
                dataType: 'json',
                data: {
                    estado: table_1.data("estado")
                },
                error: function(e) {
                    console.error(e.responseText);
                }
            },
            order: [
                [0, 'desc']
            ],
            pageLength: 10,
            columnDefs: [{
                targets: 7,
                orderable: false
            }],
            columns: [
                { data: 'id' },
                { data: 'mesa' },
                { data: 'cliente' },
                { data: 'cant_personas' },
                {
                    data: 'pagado',
                    render: function(data, type, row) {
                        return input_pagado(row);
                    }
                },
                {
                    data: 'estado',
                    render: function(data, type, row) {
                        return `<button type='button' class="btn btn-warning btnEstado" data-id='${row.id}'>Recibido</button>`;
                    }
                },
                { data: 'total' },
                {
                    data: 'id',
                    render: function(data, type, row) {
                        return input_detalle(row);
                    }
                }
            ]
        });

        //Table 2
        table_2 = $('#table-data2').DataTable({
            language: {
                url: url_base + "resources/assets/json/Spanish.json"
            },
            destroy: true,
            scrollX: true,
            ajax: {
                type: 'POST',
                url: url_base + 'pedido/show',
                dataType: 'json',
                data: {
                    estado: table_2.data("estado")
                },
                error: function(e) {
                    console.error(e.responseText);
                }
            },
            order: [
                [0, 'desc']
            ],
            pageLength: 10,
            columnDefs: [{
                targets: 7,
                orderable: false
            }],
            columns: [
                { data: 'id' },
                { data: 'mesa' },
                { data: 'cliente' },
                { data: 'cant_personas' },
                {
                    data: 'pagado',
                    render: function(data, type, row) {
                        return input_pagado(row);
                    }
                },
                {
                    data: 'estado',
                    render: function(data, type, row) {
                        return `<button type='button' class="btn btn-success btnEstado" data-id='${row.id}'>Atendido</button>`;
                    }
                },
                { data: 'total' },
                {
                    data: 'id',
                    render: function(data, type, row) {
                        return input_detalle(row);
                    }
                }
            ]
        });

        //Table 3
        table_3 = $('#table-data3').DataTable({
            language: {
                url: url_base + "resources/assets/json/Spanish.json"
            },
            destroy: true,
            scrollX: true,
            ajax: {
                type: 'POST',
                url: url_base + 'pedido/show',
                dataType: 'json',
                data: {
                    estado: table_3.data("estado")
                },
                error: function(e) {
                    console.error(e.responseText);
                }
            },
            order: [
                [0, 'desc']
            ],
            pageLength: 10,
            columnDefs: [{
                targets: 7,
                orderable: false
            }],
            columns: [
                { data: 'id' },
                { data: 'mesa' },
                { data: 'cliente' },
                { data: 'cant_personas' },
                {
                    data: 'pagado',
                    render: function(data, type, row) {
                        return input_pagado(row);
                    }
                },
                {
                    data: 'estado',
                    render: function(data, type, row) {
                        return `<button type='button' class="btn btn-danger btnEstado" data-id='${row.id}'>Cancelado</button>`;
                    }
                },
                { data: 'total' },
                {
                    data: 'id',
                    render: function(data, type, row) {
                        return input_detalle(row);
                    }
                }
            ]
        });

        //Table 4
        table_4 = $('#table-data4').DataTable({
            language: {
                url: url_base + "resources/assets/json/Spanish.json"
            },
            destroy: true,
            scrollX: true,
            ajax: {
                type: 'POST',
                url: url_base + 'egreso/show',
                dataType: 'json',
                error: function(e) {
                    console.error(e.responseText);
                }
            },
            order: [
                [0, 'desc']
            ],
            pageLength: 10,
            columnDefs: [{
                targets: 4,
                orderable: false
            }, {
                targets: 5,
                orderable: false
            }],
            columns: [
                { data: 'id' },
                { data: 'nombre' },
                { data: 'descripcion' },
                { data: 'total' },
                { data: 'fecha' },
                {
                    data: 'id',
                    render: function(data, type, row) {
                        return `
                        <button class="btn btn-danger btn-sm btnEliminarEgreso" data-id="${row.id}">Eliminar</button>
                        <button class="btn btn-warning btn-sm btnEditarEgreso" data-id="${row.id}">Editar</button>
                        `;
                    }
                }
            ]
        });

    }

    function estado_ajax(id) {
        $.ajax({
            url: url_base + 'pedido/update/estado',
            type: 'post',
            data: { id },
            dataType: "json",
            beforeSend: function() {
                $.ajaxblock();
            },
            success: function(response) {

                $.ajaxunblock();

                if (response.response) {

                    table_1.ajax.reload();
                    table_2.ajax.reload();
                    table_3.ajax.reload();
                    respuesta_servidor(1, response.message);

                } else {
                    respuesta_servidor(2, response.message);
                }

            },
            error: controlar_error
        });
    }

    function pagado_ajax(id) {
        $.ajax({
            url: url_base + 'pedido/update/pagado',
            type: 'post',
            data: { id },
            dataType: "json",
            beforeSend: function() {
                $.ajaxblock();
            },
            success: function(response) {

                $.ajaxunblock();

                if (response.response) {

                    table_1.ajax.reload();
                    table_2.ajax.reload();
                    table_3.ajax.reload();
                    respuesta_servidor(1, response.message);

                } else {
                    respuesta_servidor(2, response.message);
                }

            },
            error: controlar_error
        });
    }

    $document.on('click', 'input.btnPdf', function(e) {
        let id = $(this).data("id");
        imprimir_detalle(id);
    });

    $document.on('click', 'input.btnDetalle', function(e) {
        let id = $(this).data("id");
        let detalle = $(this).data("detalle");
        let nota = $(this).data("nota");
        $("#table-detalle").html("");
        $("#tdTotal").text("");
        $("#tdNota").text("");
        let tr = "";
        let total = 0.00;
        detalle.forEach(e => {
            tr += `<tr>
                <td>${e.nombre}</td>
                <td>S/.${e.precio}</td>
                <td>${e.cantidad}</td>
                <td>${e.total}</td>
            </tr>`;
            total += Number(e.total);
        });
        $("#table-detalle").html(tr);
        $("#tdTotal").text("S/." + total.toFixed(2));
        $("#tdNota").text(nota);

        $("#modal").modal("show");
    });

    $document.on('click', '.btnEstado', function(e) {
        let id = $(this).data("id");
        swal({
                title: `Desea cambiar el estado del pedido CODIGO-${id}?`,
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

    $document.on('click', '.btnPagado', function(e) {
        let id = $(this).data("id");
        swal({
                title: `El pedido CODIGO-${id} esta pagado?`,
                text: "Presiona OK, para continuar.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    pagado_ajax(id);
                }
            });
    });

    $("#formInfo").on("submit", function(e) {

        e.preventDefault();

        let id = $("#id").val();
        let tipo = $("#tipo").val();
        let nombre = $("#txtNombre").val();
        let precio = Number($("#txtPrecio").val());
        let cantidad = Number($("#txtCantidad").val());
        let descuento = Number($("#txtDescuento").val())

        if (descuento != "") {
            precio = precio - descuento;
        }

        let total = precio * cantidad;

        swal({
                title: `Desea agregar el pedido de ${nombre}?`,
                text: "Presiona OK, para continuar.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {

                    agregarPedido(
                        id,
                        "1",
                        precio,
                        cantidad,
                        nombre,
                        tipo,
                        total.toFixed(2)
                    );

                    $modalProducto.modal("toggle");
                    $("#txtDescuento").val("");

                }
            });

    });

    //Metodo para solicitar data
    function getData(id) {
        $.ajax({
            url: url_base + 'pedido/' + id + '/edit',
            type: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $.ajaxblock();
            },
            success: function(response) {
                $.ajaxunblock();
                if (response) {
                    $('#codigo').val(response.id);
                    $('#mesa').val(response.mesa_id);
                    $('#persona').val(response.cant_personas);
                    $('#cliente').val(response.cliente_id).change();
                    $('#nota').val(response.nota);
                    let listaP = response.detalle;
                    $('#lista').val(listaP);
                    lista = JSON.parse(listaP)
                    llenarlista();
                    $cajaEditar.show()
                } else {
                    respuesta_servidor(3, 'No se encontro el registro que solicito.');
                }
            },
            error: controlar_error
        });
    }

    //Metodo para mostrar lista de pedidos
    function llenarlista() {
        var tr = "";
        var t = 0;
        for (let i = 0; i < lista.length; i++) {
            let total = lista[i].cantidad * Number(lista[i].precio);
            t += total;
            tr += `<tr>
                <td><button type="button" class="btn btn-sm btn-danger btnEliminar" data-nombre="${lista[i].nombre}" data-id="${lista[i].id}" data-tipo="${lista[i].tipo}"><i class="fa fa-trash"></i></button></td>
                <td>${lista[i].nombre}</td>
                <td>${lista[i].precio}</td>
                <td>${lista[i].cantidad}</td>
                <td>${total.toFixed(2)}</td>
            </tr>`;
        }
        $('#lista').val(JSON.stringify(lista));
        $("#tdTotal").text(`${t.toFixed(2)}`);
        $listaPedido.html(tr);
    }

    //Metodo para modal info del pedido
    $document.on("click", "button.btnInfo", function(e) {
        let $this = $(this);
        $("#id").val($this.data("id"));
        $("#tipo").val($this.data("tipo"));
        $("#txtNombre").val($this.data("nombre"));
        $("#txtDescripcion").val($this.data("descripcion"));
        $("#txtPrecio").val($this.data("precio"));
        $("#txtCantidad").val(1)
        $modalProducto.modal("toggle");
    })

    //Metodo para agregar el pedido al carrito
    $document.on('click', "button.btnAgregar", function(e) {
        let $this = $(this);
        let precio = Number($this.data("precio"));
        let cantidad = Number($this.data("cantidad"));
        let total = precio * cantidad;

        swal({
                title: `Desea agregar el pedido de ${$this.data("nombre")}?`,
                text: "Presiona OK, para continuar.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {

                    agregarPedido(
                        $this.data("id"),
                        $this.data("nota"),
                        precio,
                        cantidad,
                        $this.data("nombre"),
                        $this.data("tipo"),
                        total.toFixed(2)
                    );

                }
            });
    });

    //Metodo para eliminar producto
    $document.on("click", "button.btnEliminar", function(e) {

        let $this = $(this);
        let id = $this.data("id");
        let tipo = $this.data("tipo");
        swal({
                title: `Desea eliminar el pedido de ${$this.data("nombre")}?`,
                text: "Presiona OK, para continuar.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    eliminarPedido(id, tipo, $this);
                }
            });
    });

    $document.on('click', 'input.btnEditar', function(e) {
        $cajaPedido.hide();
        let id = $(this).data("id");
        getData(id);
    });

    $btnRegresar.on("click", function(e) {
        limpiar();
        $cajaEditar.hide();
        $cajaPedido.show();
    });

    function limpiar() {
        $('#codigo').val("0");
        $('#mesa').val("");
        $('#persona').val("");
        $('#cliente').val("").change();
        $('#nota').val("");
        $('#lista').val("");
        lista = [];
    }

    //Metodo para eliminar un pedido
    function eliminarPedido(id, tipo, el) {
        for (let i = 0; i < lista.length; i++) {

            if (id == lista[i].id && tipo == lista[i].tipo) {
                lista.splice(i, 1);
                el.parent().parent().remove();
                respuesta_servidor(1, "Pedido eliminado!");
                break;
            }

        }

        llenarlista();

    }

    //Metodo para agregar un pedido
    function agregarPedido(id, nota, precio, cantidad, nombre, tipo, total) {
        lista.push({
            "id": id,
            "nota": nota,
            "precio": precio,
            "cantidad": cantidad,
            "nombre": nombre,
            "tipo": tipo,
            "total": total
        });
        respuesta_servidor(1, "Pedido agregado!");
        $('#lista').val(JSON.stringify(lista));
        llenarlista();
    }

    //Metodo para eliminar egreso
    function eliminar_ajax(id) {
        $.ajax({
            url: url_base + 'egreso/destroy',
            type: 'POST',
            dataType: 'json',
            data: {
                id: id
            },
            beforeSend: function() {
                $.ajaxblock();
            },
            success: function(response) {
                $.ajaxunblock();
                if (response.response) {
                    table_4.ajax.reload();
                    respuesta_servidor(1, response.message);
                } else {
                    respuesta_servidor(3, 'No se pudo eliminar el registro.');
                }
            },
            error: controlar_error
        });
    }

    //Metodo para solicitar data de egreso
    function getDataEgreso(id) {
        $.ajax({
            url: url_base + 'egreso/' + id + '/edit',
            type: 'GET',
            dataType: 'json',
            beforeSend: function() {
                $.ajaxblock();
            },
            success: function(response) {
                $.ajaxunblock();
                if (response) {
                    $('#codigoE').val(response.id);
                    $('#nombreE').val(response.nombre);
                    $('#descripcionE').val(response.descripcion);
                    $('#montoE').val(response.total);
                    $modalEgreso.find('form').attr("action", url_base + 'egreso/update');
                    $modalEgreso.modal("show");
                } else {
                    respuesta_servidor(3, 'No se encontro el registro que solicito.');
                }
            },
            error: controlar_error
        });
    }


    //Metodo para eliminar egreso
    $document.on("click", "button.btnEliminarEgreso", function(e) {

        let $this = $(this);
        let id = $this.data("id");
        swal({
                title: `Desea eliminar el egreso de CODIGO ${id}?`,
                text: "Presiona OK, para continuar.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    eliminar_ajax(id);
                }
            });
    });

    $document.on('click', 'button.btnEditarEgreso', function(e) {
        let id = $(this).data("id");
        getDataEgreso(id);
    });

    $modalEgreso.on('hidden.bs.modal', function(e) {
        $(":input.is-invalid").removeClass('is-invalid');
        $(".error.invalid-feedback").remove();
        $('#codigoE').val('0');
        $modalEgreso.find('form').attr("action", url_base + 'egreso/store');
        $modalEgreso.find('form').trigger('reset');
    });

    $btnAgregarEtiqueta.on('click', function(e) {
        let precio = $("#precioEx");
        let nombre = $("#nombreEx");
        let cantidad = $("#cantidadEx");

        if (precio.val() != "" && nombre.val() != "") {

            let total = Number(precio.val()) * Number(cantidad.val());

            agregarPedido(0, "1", Number(precio.val()), Number(cantidad.val()), nombre.val(), 'extra', total);
            nombre.val("")
            precio.val("")
            cantidad.val(1);
        } else {
            respuesta_servidor(3, "Ingrese los datos necesarios.")
        }

    });


    $(function() {
        inicializar_table();

        setInterval(function() {
            table_1.ajax.reload();
            table_2.ajax.reload();
            table_3.ajax.reload();
        }, 20000);

        $("#lista-productos").dataTable({
            language: {
                url: url_base + "resources/assets/json/Spanish.json"
            },
            info: false,
            pageLength: 10,
            columnDefs: [{
                targets: 2,
                orderable: false
            }],
        });

        $modalProducto.on('hidden.bs.modal', function(e) {
            $("#id").val("");
            $("#tipo").val("");
            $("#txtNombre").val("");
            $("#txtDescripcion").val("");
            $("#txtPrecio").val("");
            $("#txtCantidad").val(1);
        });

        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        });

    });

})(jQuery);