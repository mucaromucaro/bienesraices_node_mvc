//const express = require("express") // this is the way old 
import express from "express"// this the way new. to use this forn firts you have to put in the archive packege.json "type" :"module"
import usuarioRauter from "./rautes/usuarioRaut.js";//here we are import the archive where are the rautes
import propiedadesRauter from "./rautes/propiedadesRaut.js";
import appRauter from "./rautes/appRaut.js";
import appiRauter from "./rautes/appiRaut.js";
import db from "./confi/db.js"; // here we are import the tadatable
import csrf from "csurf"; // this is to enable protection of the formularios but we have dowload
import cookieParser from "cookie-parser";// this is to work well csurft
import { cookie } from "express-validator";

//crear app
const app = express()

 // esto es para habilitar y poder leer los datos que rescribo en el formulario
 app.use(express.urlencoded({extended: true}))

 //habilitar cookie parser
/app.use (cookieParser())

 //habilitar csurt
 app.use(csrf({cookie:true}))


// esta la connecion ala datatable
try {
   await db.authenticate();
   db.sync()  // esto es para crear tablas que no esistan en labase de datos
   console.log("estas conectado ala base de datos");
   
} catch (error) {
   console.log(error);
   
   
}

//habilitar pug
app.set("view engine", "pug")//firts we have to donload pug
app.set("views", "./views")// this is the ubication where are the views

//carpeta publica
app.use(express.static("public"))// here we can faind all the designs

//rauting o rutas
app.use("/",appRauter)  // this is the way, how we can use of appRauter 
app.use("/auth",usuarioRauter) // this is the way ,how we can use  of usuarioRauter 
app.use("/",propiedadesRauter) // this is the way, how we can use of propiedadesRauter 
app.use("/api",appiRauter)



//definir un puerto donde arranca el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () =>{
   console.log("estas conectado al servidor " + port);
   
})
