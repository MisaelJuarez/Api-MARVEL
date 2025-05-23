import express from 'express';
import cors from 'cors';
import router from './routes/web.js';
import Conexion from './config/Conexion.js';
import path from 'path';

const app = express();
Conexion();
app.use(express.json());
app.use(cors()); 
app.use('/uploads', express.static(path.join(process.cwd(), '/', 'uploads')));
app.use("",router)

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO,() => {
    console.log(`✅ El servidor esta corriendo`);
    console.log(`✔️ url: http://localhost:${PUERTO}`);
})