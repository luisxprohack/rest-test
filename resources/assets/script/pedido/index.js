(function($) {

    $('.select2').select2();

    const $paso1 = $("#paso1"),
        $paso2 = $("#paso2"),
        $paso3 = $("#paso3"),
        $volverPaso2 = $("#volverPaso2"),
        $volverPaso3 = $("#volverPaso3"),
        $lista = $(".lista"), //input lista
        $total = $(".total"), //input total
        $btnCarrito = $("#btnCarrito"),
        $btnPedir = $("#btnPedir"),
        $listaPedido = $(".lista-pedido");

    const $btnAgregarEtiqueta = $('#btnAgregarEtiqueta');

    const $tdTotal = $(".tdTotal");

    const $btnRegresar = $("#btnRegresar");

    const $cajaEditar = $("#cajaEditar");

    var lista = [];

    //Metodo para seleccionar numero de mesa
    $document.on("click", ".mesa", function(e) {
        e.preventDefault();
        let $this = $(this);
        let id = $this.data("id");
        $paso1.hide();
        $paso2.show();
        $("#mesa").val(id);
        //cambiarEstado(id);
    });

    $document.on("click", "button#btnVender", function(e) {
        $paso1.hide();
        $cajaEditar.show();
    });

    $btnRegresar.on("click", function(e) {
        window.location.reload();
    });

    function cambiarEstado(mesa) {

        let datos = new FormData();

        datos.append("estado", 2);
        datos.append("mesa", mesa);

        $.ajax({
            url: url_base + "pedido/evento/estado",
            method: "POST",
            data: datos,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            beforeSend: function() {
                $.ajaxblock();
            },
            success: function(response) {
                $.ajaxunblock();
                //console.log(response);
            },
            error: controlar_error

        });
    }

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

                    $modal.modal("toggle");
                    $("#txtDescuento").val("");

                }
            });

    });

    //Metodo para modal info del pedido
    $document.on("click", "button.btnInfo", function(e) {
        let $this = $(this);
        $("#id").val($this.data("id"));
        $("#tipo").val($this.data("tipo"));
        $("#txtNombre").val($this.data("nombre"));
        $("#txtDescripcion").val($this.data("descripcion"));
        $("#txtPrecio").val($this.data("precio"));
        $("#txtCantidad").val(1)
        $modal.modal("toggle");
    })

    $modal.on('hidden.bs.modal', function(e) {
        $("#id").val("");
        $("#tipo").val("");
        $("#txtNombre").val("");
        $("#txtDescripcion").val("");
        $("#txtPrecio").val("");
        $("#txtCantidad").val(1);
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

    //Metodos para volver al formulario anterior
    $volverPaso2.on('click', function(e) {
        e.preventDefault();
        window.location.reload();
    });

    $volverPaso3.on('click', function(e) {
        e.preventDefault();
        $paso3.hide();
        $paso2.show();
    });

    //Metodo para validar button de carrito y pedir
    function habilitarButton() {

        if (lista.length > 0) {
            $btnCarrito.attr("disabled", false);
            $btnPedir.attr("disabled", false);
            $btnCarrito.find("span").text(Number(lista.length));
        } else {
            $btnCarrito.find("span").text(0);
            $btnCarrito.attr("disabled", true);
            $btnPedir.attr("disabled", true);
        }

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
        if (lista.length > 0) {
            $lista.val(JSON.stringify(lista));
        } else {
            $lista.val("");
            $total.val("");
        }
        llenarlista();
        habilitarButton();

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
        $lista.val(JSON.stringify(lista));
        habilitarButton();
        llenarlista();
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

        $listaPedido.html(tr);
        $total.val(t);
        $tdTotal.text(`${t.toFixed(2)}`);
    }

    //Metodo para enviar al formulario 3
    $btnCarrito.on('click', function(e) {
        $paso2.hide();
        $paso3.show();
        let persona = $("#persona").val();
        let mesa = $("#mesa").val();
        $("#persona_2").val(persona);
        $("#mesa_2").val(mesa);
        llenarlista();
    });

    //Metodo para solicitar el pedido
    $btnPedir.on("click", function(e) {
        let $this = $(this);
        let datos = new FormData();

        let mesa = $("#mesa_2").val();
        let persona = $("#persona_2").val();
        let nota = $("#nota").val();
        let detalle = JSON.stringify(lista);
        let total = $("#tdTotal").text();
        let cliente = $('#cliente').val();

        datos.append("mesa", mesa);
        datos.append("cliente", cliente);
        datos.append("estado", 3);
        datos.append("persona", persona);
        datos.append("nota", nota);
        datos.append("detalle", detalle);
        datos.append("total", Number(total).toFixed(2));

        $.ajax({
            url: url_base + "pedido/store",
            method: "POST",
            data: datos,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            beforeSend: function() {
                $.ajaxblock();
            },
            success: function(response) {
                $.ajaxunblock();
                if (response.response) {

                    respuesta_servidor(1, response.message)
                        .then((value) => {
                            window.location.reload();
                        });

                } else {
                    respuesta_servidor(2, response.message);
                }

            },
            error: controlar_error

        });

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

        //Inicializar datable
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

        $("#lista-bebidas").dataTable({
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

    });

})(jQuery);