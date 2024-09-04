import { DataTypes, } from "sequelize";
import db from "../confi/db.js";


const Mensaje = db.define("mensaje",{

    mensaje:{
    type:DataTypes.STRING(200),
    allowNull: false,
 },
})

//Propiedad.belongsTo(Categoria,{foreignKey:"categoriaid"})



export default Mensaje