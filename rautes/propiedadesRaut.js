import express from "express"
import { body } from "express-validator"// like we wil validate in the rauter we have to change check, validationResult to: body como vamos a validar en el rauter o ruta tenemos que cambiar  check, validationResult por body
import { admin,crear,guardar,agregarImagen,almacenarImagen,editar,guardarCambios,
eliminar,mostrarPropiedad,enviarMensaje,verMensaje,cambiarEstado} from "../controller/propiedaController.js"
import protegerRuta from "../middieware/protegerRuta.js"
import upload from "../middieware/subirArchivo.js"
import identificarUsuario from "../middieware/identificarUsuario.js"

const rauter = express.Router()

rauter.get("/mis-propiedades",protegerRuta,admin)
rauter.get("/propiedades/crear",protegerRuta, crear )
rauter.post("/propiedades/crear", 
    // here we are validating all the campos of the formulario
    // we are doing it here.becase this is other way of to validate
    body("titulo").notEmpty().withMessage("El titulo del anuncio es obligatorio"),
    body("descripcion").notEmpty().withMessage("La descricion  es obligatorio"),
    body("categoria").isNumeric().withMessage("Tienes que elegir una categoria"),
    body("precio").isNumeric().withMessage("Tienes que elegir un rango de precio"),
    body("habitaciones").isNumeric().withMessage("Tienes que elegir las habitaciones "),
    body("estacionamiento").isNumeric().withMessage("Tienes que elegir los estacionamientos"),
    body("wc").isNumeric().withMessage("Tienes que elegir los baños"),
    body("lat").isNumeric().withMessage("Tiene que hubicar la casa en el mapa "),protegerRuta, guardar )

    rauter.get('/propiedades/agregar-imagen/:id',protegerRuta,agregarImagen)
    rauter.post('/propiedades/agregar-imagen/:id',upload.single("imagen"),protegerRuta,almacenarImagen)

    
    rauter.get('/propiedades/editar/:id',protegerRuta,editar)
    rauter.post('/propiedades/editar/:id', protegerRuta,
        // here we are validating all the campos of the formulario
        // we are doing it here.becase this is other way of to validate
        body("titulo").notEmpty().withMessage("El titulo del anuncio es obligatorio"),
        body("descripcion").notEmpty().withMessage("La descricion  es obligatorio"),
        body("categoria").isNumeric().withMessage("Tienes que elegir una categoria"),
        body("precio").isNumeric().withMessage("Tienes que elegir un rango de precio"),
        body("habitaciones").isNumeric().withMessage("Tienes que elegir las habitaciones "),
        body("estacionamiento").isNumeric().withMessage("Tienes que elegir los estacionamientos"),
        body("wc").isNumeric().withMessage("Tienes que elegir los baños"),
         guardarCambios )

    rauter.post('/propiedades/eliminar/:id',protegerRuta,eliminar)   
    
    rauter.put('/propiedades/:id',protegerRuta,cambiarEstado)   

    rauter.get('/propiedad/:id',identificarUsuario,mostrarPropiedad)

    rauter.post('/propiedad/:id',identificarUsuario,
        body("mensaje").isLength({min:10}).withMessage("El mensaje no puede estar vacio o es muy corto"),
        enviarMensaje)
    
    rauter.get('/mensaje/:id',protegerRuta,verMensaje)   



export default rauter