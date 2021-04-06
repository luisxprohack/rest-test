(function($) {

    const $cajaPedido = $("#cajaPedido");
    const $cajaEditar = $("#cajaEditar");
    const $btnNoti = $("#btnNoti");
    const audio = document.getElementById("audio");
    const $listaPedido = $("#lista-pedido");
    const $btnRegresar = $("#btnRegresar");
    $('.select2').select2();
    var lista = [];

    $btnNoti.on("click", listar);

    const $btnAgregarEtiqueta = $('#btnAgregarEtiqueta');

    function listar() {
        $.ajax({
            type: "GET",
            url: url_base + 'pedido/notificacion/cocina',
            dataType: "json",
            success: function(response) {
                if (response.length > 0) {
                    let form = "";
                    $(".formPedido").remove();
                    $("#alerta").remove();
                    response.forEach(e => {
                        var tr = "";
                        let id = e.id;
                        let detalle = JSON.parse(e.detalle);

                        detalle.forEach((e, index) => {
                            let lista = JSON.stringify(e);
                            tr += `<tr>
                            <td>
                                <label for="p${id + e.id + index}">${e.nombre}</label>
                            </td>
                            <td>
                                ${e.cantidad}
                            </td>
                            <td>
                                <input name="producto[]" type="checkbox" id="p${id + e.id + index}" value='${lista}'>
                            </td>
                        </tr>`;

                        });

                        form += `<form role="form" class="formPedido" action="${url_base}pedido/update" method="POST">
						<div class="form-group">
							<input type="hidden" name="codigo" value="${e.id}">
							<input type="hidden" name="estado" value="1">
							<input type="hidden" name="detalle" value="${e.detalle}">
						</div>
						<div class="col-lg-3 col-xs-12 col-md-4">
							<div class="small-box bg-green">
								<div class="inner">
									<h3>
                                    ${e.mesa}
                                    </h3>
                                    <button type="button" class="btn btn-danger btnCancelar" data-id="${e.id}">Cancelar</button>
                                    <button type="button" class="btn btn-primary btnEditar" data-id="${e.id}">Editar</button>
								</div>
								<div class="icon">
									<i class="ion ion-clipboard"></i>
								</div>
								<div class="inner">
									<h4>
										Pedidos
									</h4>
									<div class="table-responsive">
										<table class="table table-hove" style="width:100%">
											<thead>
												<tr>
                                                    <th>Nombre</th>
                                                    <th>Cant.</th>
													<th></th>
												</tr>
											</thead>
											<tbody>
												${tr}
											</tbody>
										</table>
									</div>
									<button class="btn btn-block btn-primary" type="submit">Atendido
										<i class="fa fa-arrow-circle-right"></i>
									</button>
								</div>
							</div>
						</div>
                    </form>`;

                    });
                    $cajaPedido.append(form);

                } else {

                    $("#alerta").remove();
                    let alert = `<diV class="col-md-12">

                    <div class="callout callout-warning">
                        <h4>
                            Aviso!
                        </h4>
                        <p>No hay pedidos registradas aun.</p>
                    </div>
                </diV>`;
                    $cajaPedido.append(alert);

                }
            },
            error: controlar_error
        });
    }

    $document.on("submit", "form.formPedido", function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr("action");
        let method = $this.attr("method");
        let data = new FormData($this[0]);
        ajax(url, method, data, $this);
    });

    function count() {
        $.ajax({
            type: "GET",
            url: url_base + "pedido/notificacion/count",
            dataType: "json",
            success: function(response) {
                if (response.cantidad > 0) {
                    $btnNoti.find("span").removeClass('hidden');
                    $btnNoti.find("span").text(response.cantidad);
                    reproducir();
                    //notificacion();
                } else {
                    $btnNoti.find("span").addClass('hidden');
                    $btnNoti.find("span").text('0');
                }
            }
        });
    }

    function reproducir() {
        audio.src = url_base + "resources/assets/audio/sirena.mp3";
        // let promise = audio.play();
        // audio.muted = false;
        // if (promise !== undefined) {
        //     promise.then(e => {
        //         console.log("ok");
        //         setTimeout(function() {
        //             audio.pause();
        //         }, 7000);
        //     }).catch(error => {
        //         console.error("ERROR: " + error);
        //     });
        // }
    }

    function notificacion() {
        Push.create("Hola mundo", {
            body: "Hay un nuevo pedido?",
            icon: url_base + "resources/assets/img/avatar.png",
            timeout: 4000,
            onClick: function() {
                listar();
                this.close();
            }
        });
    }

    function estado_ajax(id) {
        $.ajax({
            url: url_base + 'pedido/update/estado',
            type: 'post',
            data: { id: id, estado: 2 },
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
    }

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

    $(function() {

        setInterval(count, 2000);

        $document.on("click", "button.btnCancelar", function(e) {
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

        $document.on("click", "button.btnEditar", function(e) {
            $cajaPedido.hide();
            let id = $(this).data("id");
            getData(id);
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

        $btnRegresar.on("click", function(e) {
            limpiar();
            $cajaEditar.hide();
            $cajaPedido.show();
        });

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

    $modal.on('hidden.bs.modal', function(e) {
        $("#id").val("");
        $("#tipo").val("");
        $("#txtNombre").val("");
        $("#txtDescripcion").val("");
        $("#txtPrecio").val("");
        $("#txtCantidad").val(1);
    });

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


})(jQuery);