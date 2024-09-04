import Usuario from "../models/Usuario.js" 
import { check, validationResult } from "express-validator"//this is to validate the formularios but firts we have to download 
import { generarId,generarToken } from "../helper/tokens.js"
import { emailRegistro,emailOlvidePassword, } from "../helper/email.js"
import { where } from "sequelize"
import { render } from "pug"
import bcrypt from "bcrypt" //  esto es para hachear password bur firts we have to download
import jwt  from "jsonwebtoken" // esto es para autenticar el usuario but first we have to download


// esta funcion melleva la ala vista del formulario para loguiarme
const formulariologin = (function (req,res) {
    res.render("auth/login",{
        pagina:"Iniciar Sesion",
        csrfToken: req.csrfToken()
    })   
})

// esta funcion verifica que no se encuentren fallas
const autenticar =  (async  (req,res) => {
      // validaesta   
      await check('email').isEmail().withMessage('Este campo es hobligatorio').run(req)
      await check('password').notEmpty().withMessage('El password es hobligatorio').run(req)
      
      let resultado = validationResult(req)
      
      if (!resultado.isEmpty()) {
          return res.render("auth/login",{
              pagina: "Iniciar Sesion",
              csrfToken: req.csrfToken(),
              errores: resultado.array()
      
          })
         
      }
      // aquie estamos comprovando si el usuario existe
      const usuario = await Usuario.findOne({where:{email:req.body.email}})
      if (!usuario){
          return res.render("auth/login",{
              pagina: "Iniciar Sesion",
              csrfToken: req.csrfToken(), 
              errores: [{msg: "Este usuario no existe" }]
      
          })
        
      }
    // aquie estamos comprovando si el usuario esta confirmado
      if (!usuario.confirmado){
          return res.render("auth/login",{
              pagina: "Iniciar Sesion",
              csrfToken: req.csrfToken(), 
              errores: [{msg: "Este usuario no esta confirmado" }]
      
          })
        
      }   
     // aqui estamos comprovando si la contraseña  es valida con este prototype llamado verificarPassword que creamos en el modelo usuario

    if (!usuario.verificarPassword(req.body.password)){
        return res.render("auth/login",{
            pagina: "Iniciar Sesion",
            csrfToken: req.csrfToken(), 
            errores: [{msg: "La contraseña es incorrecta" }]
    
        })
      
    }
    // esto espara autenticar el usuario 
     
     const token = generarToken({ id: usuario.id, nombre: usuario.nombre})//this function we created in helper/tokens to be able authenticate the user
     
// esto es para guardar el token de la uatenticacion en el cookie
      return res.cookie ("_token", token,{
     httpOnly: true,
    // //secure:true,
    // //sameSite:true,
     }).redirect("/mis-propiedades")
})

// este codigo es para cerrar sesion
const cerarSesion = (req,res) => {

    return res.clearCookie('_token').status(200).redirect('/auth/login')


}


// esta funcion melleva la ala vista del formulario para registrarme
const formularioRegistro = ((req,res) => {

    res.render("auth/registro",{
        pagina:"Craer una Cuenta",
        csrfToken: req.csrfToken(),
        usuario: { // este es objecto es para mantener los datos de un oformulario
            nombre : req.body.nombre,
            email: req.body.email,
        }

    })   
})

// esta funcion validada el registro
const registrar = async (req,res) => {

    //valiodacio
    await check ("nombre").notEmpty().withMessage("El nombres es hobligatorio").run(req)
    await check ("email").isEmail().withMessage("El correo es hobligatorio").run(req)
    await check ("password").isLength({min:6}).withMessage("El password debe de tener 6 caractres o mas ").run(req)
  
    let resultado = validationResult(req);
    
    // this condiccion active if there is campo rmpty
    if(!resultado.isEmpty()){
        return res.render("auth/registro",{ 
            pagina: "Crear Cuenta",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),// esto tiene los errores
            usuario: { // este es objecto es para mantener los datos de un oformulario
            nombre : req.body.nombre,
            email: req.body.email,
           
            }
            
           })
        }
          
        //verificar que el usuario no este duplicado
        const existeUsuario = await Usuario.findOne({where: {email: req.body.email}}) // esto busca un susario por el email  y si en la base de datos ya existe un usuariocon el mismo email nos mostrara un error
       

        if (existeUsuario) {
            return res.render("auth/registro",{
                pagina:"Craer una Cuenta",
                csrfToken: req.csrfToken(),
                errores: [{msg: "Este correo ya existe"}],
                usuario: { // este es objecto es para mantener los datos de un oformulario
                nombre : req.body.nombre,
                email: req.body.email}
                
            })
            
        }
      //const usuario = await Usuario.create(req.body) // esto crea la tabla de usuario si no exite
      // if everything verify are good,this code save the usuario
      const usuario = await Usuario.create({    
        nombre : req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        token: generarId() // esta funcio es para  generar un token unico but firts we have to import
        
    })
    // estos datos que le estoy pasando en un arreglo son los datos que se requieren para confirmar la cuenta
    emailRegistro({
        nombre:usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //mostar mensage de cofirmacion
    res.render("templates/mensage",{
        pagina: " La pagina esta creada",
        mensage: "Te hemos enviado un mensage de confirmacion a tu correo"
    })

}
 // esta funcion compueva una cuenta

 const confirmar = async (req , res) =>{
    // this is the way to get the token of an usuario
    const usuario = await Usuario.findOne({where:{token: req.params.token}})
    
    
    if(!usuario){ // esta codiciona se activa cuando no hay un usuario con el token  
        return res.render("auth/confirmarCuenta",{
            pagina: "Error al confirmar tu cuenta",
            mensage: "Hubo un error al confirmar tu cuenta,Intentelo de nuevo",
            error: true   
        })

    }
        //this is when usuario comfirm the accuont remuve the token
        usuario.confirmado = true; // estos son los nuevos cambisoa que hisimos
        usuario.token = null; // estos son los nuevos cambisoa que hisimos
        await usuario.save(); // esto guarda los nuevos cambios que hisimos en la base de datos
       

     // and this code is when the token exist
        return res.render("auth/confirmarCuenta",{
            pagina: "Cuenta Confirmada",
            mensage: "La cuenta se confirmo Correctamente",
            error: false
            
        })
    }

 

const formularioOlvidePassword = ((req,res) => {
    res.render("auth/olvidePassword",{
        csrfToken: req.csrfToken(),
        pagina:"Recuperar Password"
    })   
})

const resetPassword = async (req, res ) => {

    await check ("email").isEmail().withMessage("Esto no poarece un email").run(req)

    let resultado = validationResult(req);
    
    // this condiccion active if there is campo rmpty
    // o when the email is invalid
    if(!resultado.isEmpty()){

        return res.render("auth/olvidePassword",{ 
            pagina: "Recuperar Password",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),// esto tiene los errores
            usuario: {email:req.body.email}
           
            
           })
        }

        // si el correo es valido lo vamos a buscar en la base de datos

        // here we are looking for if there is someone registered in the database and usuario not exist we send meensage de error
        const usuario = await Usuario.findOne({where:{email: req.body.email}})
     if (!usuario) {
        res.render("auth/olvidePassword",{ 
            pagina: "Recuperar Password",
            csrfToken: req.csrfToken(),
            errores: [{msg: "Este email no esta registrado"}],
            usuario: {email:req.body.email}
            })
         } 

        // but if usuario exit 
          // gerar un nuevo token para agregar una nueva contraseña
            usuario.token = generarId();
            await usuario.save();

        //enviar email para restablecer password

        emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })
        // aqui estamos enviando el mensage para que sepamos que podemos cambiar el password
       res.render("templates/mensage",{
        pagina: " Cambiar Password",
        mensage: "Te hemos enviado un email con las instruciones"

       })
   

 

}
// esta funcion comprueva si el token existe
const comprovarToken = async (req,res) =>{

     // here we are  identifying if token exists
  const usuario = await Usuario.findOne ({where:{token:req.params.token}})

 if(!usuario){ // esta codiciona se activa cuando no hay un usuario con el token  
    return res.render("auth/confirmarCuenta",{
        pagina: "Restablecer  Password",
        mensage: "Hubo un error al restablecer tu password",
        error: true   
    })

}
// but exit a usuario with that token.it will show this formulario
res.render ("auth/reset-password",{
   pagina: "Reestablecer password",
   csrfToken: req.csrfToken()
  
 })

}
// this funtion save the new password
const nuevoPassword = async (req,res) =>{

    await check ("password").isLength({min:6}).withMessage("El password debe de tener 6 caractres o mas ").run(req)

    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        return res.render("auth/reset-password",{
            pagina:"Reestablecer password",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })    
    }
    const usuario = await Usuario.findOne ({where:{token:req.params.token}})
    console.log(usuario);
    
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(req.body.password, salt)
    usuario.token = null
    
    await usuario.save()

    return res.render("auth/confirmarCuenta",{
        pagina: "Restablecer  Password",
        mensage: "Has restablecido tu password",
       
    })

      


}

export{
    formulariologin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprovarToken,
    nuevoPassword,
    autenticar,
    cerarSesion
  
}
