import mongoose from "mongoose";

const marvelModelo = new mongoose.Schema({
    alias: { type: "String", required: true, unique: true },
    nombre: { type: "String", required: true },
    poder: { type: "String", required: true },
    categoria: { type: "String", required: true },
    nivel_amenaza: { type: "String", required: true },
    url: {type: "String", require: true},
    biografia:{type:"String",require:true},
    }, 
    { collection: 'xmen' } //forzamos el nombre de la colección
); 

export default mongoose.model('Xmen', marvelModelo);