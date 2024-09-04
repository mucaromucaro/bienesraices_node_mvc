import { unlink } from 'node:fs/promises' // esto es para poder eliminar una propiedad pero no hay que descargarlo solo tenemos que importalo por que es de express
import { Model, where } from "sequelize";
import {Precio,Categoria,Propiedad, Usuario,Mensaje} from "../models/index.js"; // esto importando asi por que en estos estan las relaciones de las tabls
import { esVendedor,formatearFecha } from '../helper/index.js';
import {   validationResult } from "express-validator" // this is to be able show the errores of the formulario what we validate in the rauter


const admin = async ( req,res) =>{
   //vamos ahacer un paginador pero primero tenemos que hacer tenemos que agrarle ?paginaActual=1 en la url http://localhost:3000/mis-propiedades?paginaActual=1
   // estamos colondo el paginador aqui por que aqui es donde se estan listando las propiedades
   // req.query de esta forma podemos seleccionar la pagina

   // esto es una esprecion regular
   const expresion = /^[1-9]$/

   //aqui estamos verificando si la paginaactual  existe
   if(!expresion.test(req.query.paginaActual)) {
       return res.redirect('/mis-propiedades?paginaActual=1')
   }

      // Limites y Offset para el paginador
      const limit = 10 // este es limite de unidades por pagina
      const offset = ((req.query.paginaActual * limit) - limit) // esto es para salar de 10 en 10 por pagina,ejemplo:pagina 1:muestra las primeras unidades 10,pagina 2:se salta las primeras unudades 10 y muestra de la 11 la 20 pagina 3:se salta las primeras unudades 20 y muestra de la 21 la 30 y asi sucesivamente 
   
    const {id} = req.usuario    
    // mostrar la informacion,esta es la segunda parte del crud
   // aqui estamos extrallendo las propiedades registras en la base de datos para poder listarlas y mostrarlas
                                              // limit:limit,offset:offset lo estamos colocando aqui para poder paginar
    const propiedades = await Propiedad.findAll({limit:limit,offset:offset,where:{usuarioId:id}, 
    // este  include:[{Model:Categoria, as:"categoria"}] es para acceder ala tabla de categiria
    // pedemos acceder ala tabla de categoria por que categoriaId es FK en la tabla de propiedades  
        include: [ { model: Categoria, es:"categoria" },
                   { model: Precio, es: "precio" },
                   { model: Mensaje, es: "mensaje" }]}) // estamos incluyendo mensaje para poder ver los mensajes
        
    const total = await Propiedad.count({
                where: {
                    usuarioId : id
                }
            })    
     console.log(total);
                   

                   
        res.render("propiedades/admin",{
        pagina: "Mis Propiedades",
        propiedades:propiedades,
        csrfToken: req.csrfToken(),
        paginas: Math.ceil(total / limit),// esto es para redondiar asi riva,:ej si tenemos 21 popiedades me cuente 3 paginas y mostrar el numero de pagina 
        paginaActual: Number(req.query.paginaActual), // esto es par convertir a numero
        limit:limit,
        offset:offset,
        total:total
    
    })
}
// this funtion is to show all the precios and categoria what we have in the tadabase
const crear =  async ( req,res) =>{
      
    // this way we became the categorias,precios in a array to show them
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
    
    ])
    
    res.render("propiedades/crear",{
        pagina: "Crear Propiedad",
       
        categorias:categorias,
        precios:precios,
        csrfToken: req.csrfToken(),
        datos:req.body,
       


    })

}

// esta funcion mustra los errores del formulario de lates pagina crear
const guardar = async ( req,res) =>{
    let resultado = validationResult(req) // esto esta leyendo los errores que teneomos en la ruata. de propiedadesRauter

    if (!resultado.isEmpty()) {
        const [categorias,precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        
        res.render("propiedades/crear",{
            pagina: "Crear Propiedad",
            categorias:categorias,
            precios:precios,
            csrfToken: req.csrfToken(),
            errores: resultado.array(), 
            datos: req.body
    
        })
        
    }
 //esta es la mejos manera de hacerlo,aplicado distorchori y para renombrar la variables le pongo : al frete y el nuevo nombre 
 const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaid } = req.body

 // aqui estamos creando el registo

 try {
     const propiedadGuardada = await Propiedad.create({
         titulo,
         descripcion,
         habitaciones, 
         estacionamiento, 
         wc,
         calle,
         lat,
         lng,
         precioId,
         categoriaid,
         usuarioId: req.usuario.id,
         imagen: ''
     })
     // aqui estamos estrallendo el id 
     const {id} = propiedadGuardada
     res.redirect(`/propiedades/agregar-imagen/${id}`)
        
    } catch (error) {
        console.log(error);   
    }   
}
//esta funcion es para agregar una imagen
const agregarImagen = async (req,res, ) =>{

// aqui estamos verificando si hay un id de registro existente,:this req.params.id read any value of the url
const propiedad = await Propiedad.findByPk(req.params.id)

// aqui estomos validando esta propiedad si existe
if (!propiedad) {
    res.redirect("/mis-propiedades")
}
// aqui estomos validando esta propiedad si esta publicada
if (propiedad.publicado) {
    res.redirect("/mis-propiedades")
}

// aqui estomos validando esta que la propiedad perteneca aquien vista esta pagina
// aqui estomos validando que el id de la tabla usuario y la fk en este caso usuarioId sean igules
if (req.usuario.id.toString() !== propiedad.usuarioId.toString()  ) {
    res.redirect("/mis-propiedades")  
}
res.render("propiedades/agregar-imagen",{
    pagina: "Agregar Imagen",
    propiedad:propiedad,
    csrfToken: req.csrfToken()
    
})
    
}  

const almacenarImagen = async (req,res,next) =>{

    const propiedad = await Propiedad.findByPk(req.params.id)

// aqui estomos validando esta propiedad si existe
if (!propiedad) {
    res.redirect("/mis-propiedades")
}
// aqui estomos validando esta propiedad si esta publicada
if (propiedad.publicado) {
    res.redirect("/mis-propiedades")
}
// aqui estomos validando esta que la propiedad perteneca aquien vista esta pagina
if (req.usuario.id.toString() !== propiedad.usuarioId.toString()  ) {
    res.redirect("/mis-propiedades")  
}

try {
    //req.file.filename: esta la manera de ver el nombre del archivo
    // estos nos guarda los archivos que subamos en la base de datos
    propiedad.imagen = req.file.filename //datso nuevos
    propiedad.publicado = 1 //datso nuevos
       
    await propiedad.save()// esto guatda los datos nuevos

    next()
} catch (error) {
    console.log(error)        
}
}

// esta funcion es para poder editar el formulario
const editar = async (req,res) => {

// aqui estamos verificando si hay un id de registro existente,:this req.params.id read any value of the url    
const propiedad = await Propiedad.findByPk(req.params.id)

// aqui estomos validando esta propiedad si existe
if (!propiedad) {
    res.redirect("/mis-propiedades")
}
// aqui estomos validando esta que la propiedad perteneca aquien vista esta pagina
// aqui estomos validando que el id de la tabla usuario y la fk en este caso usuarioId sean igules
// para poder usar req.usuario.id tenemos que poner nuestro middewere en el rauter
if (req.usuario.id.toString() !== propiedad.usuarioId.toString()  ) {
    res.redirect("/mis-propiedades")  
}

    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
    
    ])
    
    res.render("propiedades/editar",{
        pagina: "Editar Propiedad",
        categorias:categorias,
        precios:precios,
        csrfToken: req.csrfToken(),
        datos:propiedad // esto es para cuando presione el botton de editar se llene el formulario de automaticamente con la informacion previa

    })
}

//esta funcion es para guaradr los cambios que hagamos cundo estoa editando el formulario
const guardarCambios = async (req,res)  => {

    let resultado = validationResult(req) // esto esta leyendo los errores que teneomos en la ruata. de propiedadesRauter


    if (!resultado.isEmpty()) {
        const [categorias,precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        
        res.render("propiedades/editar",{
            pagina: "Editar Propiedad",
            categorias:categorias,
            precios:precios,
            csrfToken: req.csrfToken(),
            errores: resultado.array(), 
            datos:req.body 
        })
        
    }

// aqui estamos verificando si hay un id de registro existente,:this req.params.id read any value of the url
const propiedad = await Propiedad.findByPk(req.params.id)

// aqui estomos validando esta propiedad si existe
if (!propiedad) {
    res.redirect("/mis-propiedades")
}
// aqui estomos validando esta propiedad si esta publicada
if (propiedad.publicado) {
    res.redirect("/mis-propiedades")
}

// aqui estomos validando esta que la propiedad perteneca aquien vista esta pagina
// aqui estomos validando que el id de la tabla usuario y la fk en este caso usuarioId sean igules
// para poder usar req.usuario.id tenemos que poner nuestro middewere en el rauter
if (req.usuario.id.toString() !== propiedad.usuarioId.toString()  ) {
    res.redirect("/mis-propiedades")  
}

// aqui estamos estrallendo lo
try {
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaid } = req.body
    propiedad.set({
        titulo,
        descripcion,
        habitaciones, 
        estacionamiento, 
        wc,
        calle,
        lat,
        lng,
        precioId,
        categoriaid,
       

    })
    await propiedad.save()
    res.redirect("/mis-propiedades") 
    
} catch (error) {
    console.log(error);
    
    
}

}
// esta funcion es para eliminar alguna propiedad publicada
const eliminar = async (req, res) => {
    
    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    //esta es la formade Eliminar la imagen con espress
     if (propiedad.imagen){
         await unlink(`public/uploads/${propiedad.imagen}`)   
        console.log(`Se eliminó la imagen ${propiedad.imagen}`)     

     }
  
  
    console.log(`Se eliminó la imagen ${propiedad.imagen}`)

    // Eliminar la propiedad
    await propiedad.destroy()
    res.redirect('/mis-propiedades')
}

// esta funcion es para modificar el estado de la propiedad
const cambiarEstado = async (req, res) => {

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    // este codigo cambia el estado de la propiedad ejemplo.si esta publicado lo podemos despublicar
    propiedad.publicado = !propiedad.publicado

    await propiedad.save()

    res.json({
        resultado: true
    })
}

// esta funciom muestar la propiedad cuando le damos click en el titulo de la propiedad
const mostrarPropiedad = async (req, res) => {
  
    const {id} = req.params
    console.log(req.usuario);
    

    // Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include : [
            { model: Precio, es: 'precio' },
            { model: Categoria, es: 'categoria'},
        ]
    })

    if(!propiedad || !propiedad.publicado) {
        return res.redirect('/404')
    }

    //console.log(esVendedor(req.usuario.id,propiedad.usuarioId));
    
    res.render('propiedades/mostrar', {
        propiedad:propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor:esVendedor(req.usuario,propiedad.usuarioId)
    })
    

   
}

const enviarMensaje = async (req,res) =>{

    const {id} = req.params
   
    // Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include : [ // esto es par incluir las tablas
            { model: Precio, es: 'precio' },
            { model: Categoria, es: 'categoria'},
        ]
    })

    if(!propiedad || !propiedad.publicado) {
        return res.redirect('/404')
    }
    // esta es la validacion del mensaje
    let resultado = validationResult(req)

    if(!resultado.isEmpty()) {

        return res.render('propiedades/mostrar', {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor:esVendedor(req.usuario.id,propiedad.usuarioId),
            errores: resultado.array(),
            usuario: req.body,

        })
      
    }
// aqui estamos estrallendo los datos que necesitamos
    const { mensaje } = req.body
    const { id: propiedadId } = req.params //aqui estraemos los datos y lo renombramos
    const { id: usuarioId } = req.usuario//aqui estraemos los datos y lo renombramos

    // Almacenar el mensaje y crea la trabla con sus respectivos campos
    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })
     

    res.redirect('/')  
}

//  esta funcion es para que el puedaver los mensages que le envian
const verMensaje = async (req,res) => {

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id,{
        include: [
            
            { model: Mensaje, es: 'mensajes',
                include: [// estamos crusando el usuario aqui por que lo necesitamos con mensaje si lo cusamos como le hemos hecho anteriormente ni funcionaria
                    {model: Usuario.scope('eliminarPassword'), as: 'usuario'}
                ]
             }
        ],
    })
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }

   
    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha
       
    })

}



 


export{
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensaje
}

