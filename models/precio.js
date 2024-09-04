import { DataTypes } from "sequelize";
import db from "../confi/db.js";
//import Propiedad from "./propiedad.js";
import Categoria from "./categoria.js";




const Precio = db.define("precios",{

    nombre:{
    type:DataTypes.STRING(50),
    allowNull: false,
 },


})
//Propiedad.belongsTo(Precio)







export default Precio