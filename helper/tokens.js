import jwt  from "jsonwebtoken" // esto es para autenticar el usuario but first we have to download

// esto genera id para los token unicos
const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32) 

//esto espara autenticar el usuario and we are creating our first token
const generarToken =  datos => jwt.sign({ id : datos.id, nombre: datos.nombre }, process.env.SECRET_P, { expiresIn: '1d' })
 

export {
   
    generarId,
    generarToken
}


