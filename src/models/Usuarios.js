import mongoose from "mongoose";

const UsuariosModelo = new mongoose.Schema({
    usuario:{type:"String",require:true,unique:true},
    password:{type:"String",require:true},
    rol:{type:"number",require:true},
    estado:{type:"String",require:true}
});

export default mongoose.model('Usuarios',UsuariosModelo);