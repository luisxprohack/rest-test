// const pusher = new Pusher("key-1", {
//     cluster: 'mt1',
//     //wsHost: "157.230.230.146",
//     wsHost: "127.0.0.1",
//     wsPort: 6001,
//     forceTLS: false,
//     disableStats: true,
// });


// var channel = pusher.subscribe("mesa");


// channel.bind('MesaEstado', function(data) {

//     if (data.mesa && data.estado) {

//         let $mesa = $('#mesa' + data.mesa);

//         if (data.estado == 1) {
//             $mesa.removeClass("bg-yellow");
//             $mesa.removeClass("bg-red");
//             $mesa.addClass("bg-green");
//         }

//         if (data.estado == 2) {
//             $mesa.removeClass("bg-green");
//             $mesa.removeClass("bg-red");
//             $mesa.addClass("bg-yellow");
//         }

//         if (data.estado == 3) {
//             $mesa.removeClass("bg-green");
//             $mesa.removeClass("bg-yellow");
//             $mesa.addClass("bg-red");
//         }

//     }

// });