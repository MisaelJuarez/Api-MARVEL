import mongoose from "mongoose";

const marvelModelo = new mongoose.Schema({
    alias:{type:"String",require:true,unique:true},
    nombre:{type:"String",require:true},
    poder:{type:"String",require:true},
    categoria:{type:"String",require:true},
    nivel_amenaza:{type:"String",require:true},
    url:{type:"String",require:true},
    biografia:{type:"String",require:true},
});

export default mongoose.model('vengadores',marvelModelo);