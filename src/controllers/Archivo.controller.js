import axios from 'axios';
import fs from 'fs';
import path from 'path';

const cargar_imagen = async (req, res) => {
  const { alias, url } = req.body;

  if (!url) return res.status(400).json({ estatus: 'error', msj: 'Falta la URL' });

  try {
    const extension = path.extname(url).toLowerCase();
    const nombre = `${alias}_${Date.now()}${extension}`;
    const ruta = path.join('uploads', nombre);

    const respuesta = await axios.get(url, { responseType: 'stream' });
    const escribir = fs.createWriteStream(ruta);
    respuesta.data.pipe(escribir);

    escribir.on('finish', () => {
      res.status(200).json({ estatus: 'correcto', archivo: nombre });
    });

    escribir.on('error', () => {
      res.status(500).json({ estatus: 'error', msj: 'No se pudo guardar la imagen' });
    });

  } catch (error) {
    res.status(500).json({ estatus: 'error', msj: 'Error al descargar la imagen' });
  }
};

export { cargar_imagen };
