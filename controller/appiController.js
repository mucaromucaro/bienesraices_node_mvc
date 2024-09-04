import { Propiedad, Precio, Categoria } from '../models/index.js'

// this is a  api to became all propiedades in a json
const propiedades = async (req, res) => {

    const propiedades = await Propiedad.findAll({
        include: [
            {model: Precio, es: 'precio'},
            {model: Categoria, es: 'categoria'},
        ]
    })


    res.json(propiedades)
}


export {
propiedades
}