(function(){
    const lat =  6.25184; 
    const lng = -75.56359;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 13);

    let markers = new L.FeatureGroup().addTo(mapa)// esto es palimpiar el resultado previo y mostrar 

    let propiedades = [];

    // esto es para Filtar
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa)

    // Filtrado de Categorias y precios

    categoriasSelect.addEventListener("change", e =>{
        filtros.categoria = +e.target.value // signo + adelante de la e es para convetilo a numero
        filtrarPropiedades()
          
    })

    preciosSelect.addEventListener("change", e =>{
        filtros.precio = +e.target.value
        filtrarPropiedades()
          
    })


   // estamos octeniendo las propiedadsdes
    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()
            mostrarPropiedades(propiedades)
            console.log(propiedades);
            
          
            
        } catch (error) {
            console.log(error)
        }
    }
    const mostrarPropiedades = propiedades => {

        // Limpiar los markers previos
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            // Agregar los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng ], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad.categorium.nombre}</p>
                <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-400 block p-2 text-center text-white font-bold uppercase">Ver Propiedad</a>
            `)
            markers.addLayer(marker)
        })
    }

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter( filtrarCategoria ).filter( filtrarPrecio )
        mostrarPropiedades(resultado)
        console.log(resultado);
        
    }

     // estomos verificado que alla algoen categia  
    const filtrarCategoria =  (propiedad) => {
        return filtros.categoria ? propiedad.categoriaid === filtros.categoria : propiedad
    }
    
     const filtrarPrecio = (propiedad) => {
        return filtros.precio ? propiedad.precioId === filtros.precio : propiedad
     }


    obtenerPropiedades()


})()