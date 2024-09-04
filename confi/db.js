import  Sequelize  from "sequelize"; // esto es el orm y sirve para poder connectarlos a una base de datos previamemnte creada

import dotenv from "dotenv"; // this is to be able hide the datas privates of the tadabase but firts we have to download
dotenv.config({path: ".env"}) // and we can faind here

// that is how we have to connect at the database

                         //bienesraices is the name of the tadabase  //root is the name usuario  // and andres is the password
//para ocultar el nombre de la base de datos,el usuario and la contraseña te nemos que intalar en la terminal dotenv
//then we create a file call .env y ocultamos los datos previos y le damos un alias y esos alias los ponemos alli
// de esta manera; process.env.BD_NOMBRE 
 const db = new Sequelize (process.env.BD_NOMBRE,process.env.BD_USER,process.env.BD_PASS, {
    host: process.env.BD_LOCAL,
    port: 3306,
    dialect: "mysql",
    define: {
         timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

export default db