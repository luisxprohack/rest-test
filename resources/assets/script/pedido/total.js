(function($) {

    var minDateFilter = "";
    var maxDateFilter = "";
    const $txtT = $("#txtTotal"),
        $txtPagado = $("#pagado");

    //Metodo para filtrar  por rango de fechas
    function filtrar_fecha(columna, min, max) {

        if (min != '' && max != '') {
            return columna >= min && columna <= max;
        } else {
            return false;
        }
    }

    function filtrar_pagado(columna, value) {
        if (columna == value) {
            return true;
        }
        return false;
    }


    $.fn.dataTableExt.afnFiltering.push(
        function(settings, data, dataIndex) {

            let date = moment(data[8]).format('YYYY-MM-DD');

            if (
                (filtrar_fecha(date, minDateFilter, maxDateFilter) && filtrar_pagado(data[5], "")) ||
                (filtrar_pagado(data[5], $txtPagado.val()) && filtrar_fecha(date, minDateFilter, maxDateFilter))
            ) {
                return true;
            }

            return false;
        }
    );

    function inicializar_date() {

        let start = moment();
        let end = moment();

        function cb(start, end) {
            $('#reportrange span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
            //console.log(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
            maxDateFilter = end.format('YYYY-MM-DD');
            minDateFilter = start.format('YYYY-MM-DD');
            table.draw();
        }

        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
                'Hoy': [moment(), moment()],
                'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
                'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                'Este mes': [moment().startOf('month'), moment().endOf('month')],
                'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            "locale": {
                "format": "MM/DD/YYYY",
                "separator": " - ",
                "applyLabel": "Aplicar",
                "cancelLabel": "Cancelar",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "Rango Personalizado",
                "daysOfWeek": [
                    "Dom",
                    "Lun",
                    "Mar",
                    "Mie",
                    "Jue",
                    "Vie",
                    "Sab"
                ],
                "monthNames": [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre"
                ],
                "firstDay": 1
            }
        }, cb);

        cb(start, end);

    }

    function inicializar_table() {

        table = $('#table-data').DataTable({
            language: {
                url: url_base + "resources/assets/json/Spanish.json"
            },
            destroy: true,
            ajax: {
                type: 'POST',
                url: url_base + 'pedido/show',
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
                    targets: 8,
                    orderable: false
                },
                {
                    targets: 9,
                    orderable: false
                }
            ],
            columns: [
                { data: 'id' },
                { data: 'empleado' },
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
                        return input_estado(row);
                    }
                },
                { data: 'total' },
                { data: 'fecha' },
                {
                    data: 'id',
                    render: function(data, type, row) {
                        return input_detalle(row);
                    }
                }
            ],
            footerCallback: function(row, data, start, end, display) {
                var api = this.api(),
                    data;

                // Remove the formatting to get integer data for summation
                var intVal = function(i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                        i : 0;
                };

                // Total over all pages
                total = api
                    .column(7)
                    .data()
                    .reduce(function(a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total over this page
                pageTotal = api
                    .column(7, { page: 'current' })
                    .data()
                    .reduce(function(a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Update footer
                // $(api.column(7).footer()).html(
                //     'S/.' + pageTotal.toFixed(2)
                // );
                // $txtS.val('S/.' + pageTotal.toFixed(2));

                $(api.column(9).footer()).html(
                    'S/.' + pageTotal.toFixed(2)
                );
                $txtT.val('S/.' + pageTotal.toFixed(2));

            }
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

                    table.ajax.reload();
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
        $formAjax.attr("action", url_base + 'pedido/store');
        $formAjax.trigger('reset');
    });

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

    $(function() {
        inicializar_table();
        inicializar_date();

        $txtPagado.on('change', function(e) {
            table.draw();
        });
    });

})(jQuery);