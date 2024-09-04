import express from 'express'
import { propiedades } from '../controller/appiController.js'

const rauter = express.Router()


rauter.get('/propiedades', propiedades)


export default rauter