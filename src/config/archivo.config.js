import multer from "multer";
import path from "path";

//Fomratos de imagene permitidos
const extensionesImagenes = ['.jpg','.jpeg','.png','.gif','.webp'];

//usamos la libreria multer para definir los datos del archivo
const storage = multer.diskStorage({
    //carpeta de destino
    destination: (recibido,file,cb) => {
        //carpeta uploads (debe estar en la raiz del proyecto)
        cb(null, 'uploads/');
    },
    //nombre del archivo
    filename: (recibido,file,cb) => {
        //se genera un nombre unico apartir de la fehca en que se subio y la extension
        cb(null,Date.now()+path.extname(file.originalname));
    }
})

//Validaciones de archivos
const fileFilter = (recibido,file,cb) => {
    //validamos el tipo de extension del archivo
    const extension = path.extname(file.originalname).toLowerCase();
    //Hace efectiva la validacion
    if (extensionesImagenes.includes(extension)) {
        cb(null,true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo imagenes (jpg, jpeg, png, gif, webp)'),false);
    }
}

//definimos el tamaño maximo del archivo
const limits = { fileSize: 3 * 1024 * 1024 };
//creamos una constante upload, esta contendra las caracteristicas definidas de multer
const uploads = multer({storage,fileFilter,limits});

export default uploads;
