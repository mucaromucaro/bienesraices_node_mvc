import multer from "multer"; // esto para leer los archivos que subamos.but we have to download
import path from "path"
import { generarId } from "../helper/tokens.js";
 
// esta funcion es para poder subir los archivos sin errores
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/') // esta es la ruta donde se guarda
    },
    filename: function(req, file, cb) {
        cb(null, generarId() + path.extname(file.originalname) )
    }
})

const upload = multer({ storage })

export default upload