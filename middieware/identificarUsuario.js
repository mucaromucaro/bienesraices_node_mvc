import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'

const identificarUsuario = async (req, res, next) => {
    // Verificar si hay un token
   
    const {_token} = req.cookies
    if(!_token) {
        req.usuario = null
        return next()
    }
    // Comprobar el Token

    try {
        const decoded = jwt.verify(_token, process.env.SECRET_P)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
     
        
        // Almacenar el usuario al Req
        if(usuario) {
            req.usuario = usuario
        }  else {
            return res.redirect('/auth/login')
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login')
    }
   
}

export default identificarUsuario