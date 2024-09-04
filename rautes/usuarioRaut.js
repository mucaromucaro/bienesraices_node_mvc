import express from "express"
import { formulariologin,
         formularioRegistro,
        formularioOlvidePassword,registrar,
        confirmar,
        resetPassword,comprovarToken,nuevoPassword,autenticar,cerarSesion} from "../controller/usuarioController.js"
import { router } from "server"

const rauter = express.Router()

rauter.get ("/login", formulariologin) 
rauter.post ("/login", autenticar) 

//cerrar secion
rauter.post ("/cerrar-sesion", cerarSesion) 

rauter.get ("/registro", formularioRegistro) 
rauter.post ("/registro", registrar) // este es typo post por que esnesario para enviar mencsages

 // esta ruta con /:token es para poder leer el token,i callrd it token. but we can call it whatever we want because is a variable
rauter.get("/confirmar/:token",confirmar)

rauter.get ("/olvidePassword", formularioOlvidePassword) 
rauter.post ("/olvidePassword", resetPassword) 

// esta ruta de aqui almacena el nuevo password
rauter.get ("/olvidePassword/:token",comprovarToken) 
rauter.post ("/olvidePassword/:token",nuevoPassword) 

export default rauter