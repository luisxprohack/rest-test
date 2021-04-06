(function($) {

    var minDateFilter = "";
    var maxDateFilter = "";
    const $txtT = $("#txtTotal");
    const $modalEgreso = $("#modal-egreso");

    //Metodo para filtrar  por rango de fechas
    function filtrar_fecha(columna, min, max) {

        if (min != '' && max != '') {
            return columna >= min && columna <= max;
        } else {
            return false;
        }
    }

    $.fn.dataTableExt.afnFiltering.push(
        function(settings, data, dataIndex) {

            let date = moment(data[4]).format('YYYY-MM-DD');

            if (
                (filtrar_fecha(date, minDateFilter, maxDateFilter))
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
                    .column(3)
                    .data()
                    .reduce(function(a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total over this page
                pageTotal = api
                    .column(3, { page: 'current' })
                    .data()
                    .reduce(function(a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Update footer
                // $(api.column(7).footer()).html(
                //     'S/.' + pageTotal.toFixed(2)
                // );
                // $txtS.val('S/.' + pageTotal.toFixed(2));

                // $(api.column(9).footer()).html(
                //     'S/.' + pageTotal.toFixed(2)
                // );
                $txtT.val('S/.' + pageTotal.toFixed(2));

            }
        });

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
                    table.ajax.reload();
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


    $(function() {
        inicializar_table();
        inicializar_date();
    });

})(jQuery);