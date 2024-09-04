import categorias from "./categoria.js";
import precios from "./precio.js";
import db from "../confi/db.js";
import insertarUsuario from "./usuario.js";
import {Precio,Categoria,Usuario} from "../models/index.js";

// esta funcion es parta insertardatos de forma masiva
const importarDatos = async () =>{

    try {
        // autenticar
        await db.authenticate()

        //generar las columnas de la tabla
        await db.sync()

        // insertar los datos
        await Promise.all([
             // y de esta manera las dos se ejecutan ala misma vez 
            await Categoria.bulkCreate(categorias),
            await Precio.bulkCreate(precios),
            await Usuario.bulkCreate(insertarUsuario)

        ])

    // de esta forma es cuando una tabla depende de otra 
      //await Categoria.bulkCreate(categorias)
      //await Precio.bulkCreate(precios)
        console.log("datos insertados");
        process.exit()
        
        
    } catch (error) {
        console.log(error);
        process.exit(1)   
    }

}

const eliminarDatos = async () =>{

    try {
        // there is two war to be some, this is one
        // await Promise.all([
        //      // y de esta manera las dos se ejecutan ala misma vez 
        //     await Categoria.destroy({where: {}, truncate:true}),
        //     await Precio.destroy({where: {}, truncate:true})
        // ])
        
        // and this is the other
        await db.sync({force:true})

        console.log("datos eliminados");
        process.exit()
        
    } catch (error) {
        console.log(error);
        process.exit(1)   
    }

}

if (process.argv[2] === "-e") { //el .argv; this is the position where the archive what we want import is and [2];this position is where  the latter is -e
    eliminarDatos()
    
} 

if (process.argv[2] === "-i") { //el .argv; this is the position where the archive what we want import is and [2];this position is where  the latter is -i
    importarDatos()
    
}  
                                                                                                                  //[0]   [1]           [2]                      
//para poder usar esta api tenomos que crear un scripts en package.json en este caso el archivo es:   "db:importar":"node ./seed/seeder.js -i"