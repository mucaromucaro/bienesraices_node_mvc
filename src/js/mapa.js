// esto es para que el mapa aparesca,L.map('mapa') este mapa de aqui es un div con el id de mapa para la ubicacion
// la formar de llamar esto es con un scripts que tenemos que crear en:packege.js ejemplo:  "js":"webpack --watch" si no creamos esto no ppodemos utilizar
(function() {
    // lat an lng this is para la ubicacion if we want change the city we have to change these values
    // este document.querySelector es para mantene la ubicacion que le agrege al mover el pin del mapa 
    const lat = document.querySelector("#lat").value || 6.25184; 
    const lng =  document.querySelector("#lng").value ||-75.56359;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
 
    // this code is to put pint
    marker = new L.marker([lat, lng],{
        draggable: true, //and this is to move pint
        autoPan:true// and this is when we move the pint the mapa is center
    })
    .addTo(mapa)
   // this code is to read the la ubicacion del pint
    marker.on("moveend",(e) => {
        marker = e.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng)) //esto es para cundo yo suelte el pin del mapa el mapan se centre

        //esto es para octener el nombre,la latud y la longitud
        geocodeService.reverse().latlng(posicion,13).run(function (error,resultado) {
            console.log(resultado);
            marker.bindPopup(resultado.address.LongLabel)

             document.querySelector(".calle").textContent= resultado?.address?.Address ?? "";
             document.querySelector("#calle").value= resultado.address.Address ?? "";
             document.querySelector("#lat").value= resultado.latlng.lat ?? "";
             document.querySelector("#lng").value= resultado.latlng.lng ?? "";


            
        })  

        
    })

})()