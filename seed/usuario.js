import bcrypt from "bcrypt" // esto es para hachear password bur firts we have to download

// esta funcion crea un asuario para desarrollo 
const insertarUsuario = [
    {
        nombre: "andres",
        email: "andresmurillo74@gmail.com",
        confirmado:1,
        password:bcrypt.hashSync("1234567",10) //aqui estamos encrictando el password ejmplo: bcrypt.hashSync("el passwod que queramos la ponemos alli entre comillas",10)
    }
 
]

export default insertarUsuario