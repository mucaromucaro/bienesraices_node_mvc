const esVendedor = (usuarioId, propiedadUsuarioId) => {
    const resultado = usuarioId === propiedadUsuarioId
    console.log(resultado);
    
}

const formatearFecha = fecha => {
    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10)

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    }

    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones)
    
}


export {
    esVendedor,
    formatearFecha
}