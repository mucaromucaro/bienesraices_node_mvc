// everything of here we need to be able put a map
// we have to donwload webpack y webpack-cli y then we ceate this archive write it
import path from "path" // esto es para poder crear una ruta obsoluta

export default {
    mode: "development",
    entry:{
        mapa:"./src/js/mapa.js" ,// here is where it is the archive
        agregarImagen:"./src/js/agregarImagen.js", // here is where it is the archive. to add a emagen
        mostrarMapa:"./src/js/mostrarMapa.js", // here is where it is the archive. para mostrar el cuando quramos cominicarlos xon quin publico la casa
        mapaInicio:"./src/js/mapaInicio.js",
        cambiarEstado:"./src/js/cambiarEstado.js"
    },
    output:{
        filename: "[name].js",
        path: path.resolve("public/js") // esto es para guardarlo en esta carpeta 

    }

}

// una finalizado  esta cofiguracion temos que crear un script en package.json para correr webpack