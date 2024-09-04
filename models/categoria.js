import { DataTypes, } from "sequelize";
import db from "../confi/db.js";
//import Propiedad from "./propiedad.js";
import Usuario from "./Usuario.js";
import Precio from "./precio.js";

const Categoria = db.define("categoria",{

    nombre:{
    type:DataTypes.STRING(20),
    allowNull: false,
 },
})

//Propiedad.belongsTo(Categoria,{foreignKey:"categoriaid"})



export default Categoria