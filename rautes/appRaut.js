import express from 'express'
import { inicio,categoria,noEncontrado,buscador } from '../controller/appController.js'

const rauter = express.Router()
 

rauter.get("/",inicio )

rauter.get("/categoria/:id",categoria)

rauter.get("/404",noEncontrado)

rauter.post("/buscador",buscador)


export default rauter