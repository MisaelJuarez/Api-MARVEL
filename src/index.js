import express from 'express';
import cors from 'cors';
import router from './routes/web.js';
import Conexion from './config/Conexion.js';

const app = express();
app.use(express.json());
app.use(cors()); 
Conexion();
app.use("",router)

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO,() => {
    console.log(`✅ El servidor esta corriendo`);
    console.log(`✔️ url: http://localhost:${PUERTO}`);
})