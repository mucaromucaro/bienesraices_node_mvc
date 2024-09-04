import { DataTypes } from "sequelize";
//import Propiedad from "./propiedad.js";
import db from "../confi/db.js";
import bcrypt from "bcrypt" // esto es para hachear password bur firts we have to download


 
const Usuario = db.define("usuarios",{

    
    nombre:{
        type: DataTypes.STRING,
        allownull:false
    },
    email:{
        type: DataTypes.STRING,
        allownull:false
    },
    password:{
        type: DataTypes.STRING,
        allownull:false
    },
    token:{
        type: DataTypes.STRING
    },
    confirmado:{
        type: DataTypes.BOOLEAN
    }
}, {
    hooks:{// este codigo es para hachear el password
        beforeCreate:async function (usuario) {
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash(usuario.password, salt)
            
        }
    },

    // esto es para no mostrar estos campos en una  consultad
    scopes:{
        eliminarPassword:{
            attributes:{
                exclude:["password","token","confirmado"]
            }
        }
    }
})

//Propiedad.belongsTo(Usuario)

// esta funncion es pára comparar el password  que estamos colocando con el que esta en la base de datos cuando nos estemos logiando y podamos tener acxeso
Usuario.prototype.verificarPassword = function (password){
    return bcrypt.compareSync(password, this.password)
}




export default Usuario