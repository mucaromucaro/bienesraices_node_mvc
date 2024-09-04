import Usuario from "./Usuario.js";
import Categoria from "./categoria.js";
import Propiedad from "./propiedad.js";
import Precio from "./precio.js";
import Mensaje from "./mensaje.js";

Propiedad.belongsTo(Categoria,{foreignKey:"categoriaid"})
Propiedad.belongsTo(Precio)
Propiedad.belongsTo(Usuario)
Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadId'} )

Mensaje.belongsTo(Propiedad,{foreignKey:"propiedadId"})
Mensaje.belongsTo(Usuario)

export {
  Categoria,
  Precio,
  Usuario,
  Propiedad,
  Mensaje
  

}





