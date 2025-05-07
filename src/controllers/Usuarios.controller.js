import Usuarios from '../models/Usuarios.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const registro_usuario = async (req,res) => {
    try {
        const {usuario, password, rol} = req.body;
        const cifrado = await bcrypt.hash(password,10);
        const registro = new Usuarios({"usuario":usuario,"password":cifrado,"rol":rol,"estado":0});
        await registro.save();
        res.status(201).json({"msj":"Usuario registrado","registro":registro})
    } catch (error) {   
        req.status(500).json({"msj":error.msj});
    }
}

const iniciar_sesion = async (req,res) => {
    try {
        const {usuario, password} = req.body;
        const consutaUsario = await Usuarios.findOne({"usuario":usuario});
        if (!consutaUsario) return res.status(500).json({"msj":`El usuario ${usuario} no esta registrado`});
        let comparacion = await bcrypt.compare(password,consutaUsario.password);
        if(!comparacion) return res.status(500).json({"msj":"Credenciales de acceso no validas!"});

        const token = jwt.sign(
            {
                "id":consutaUsario._id,
                "rol":consutaUsario.rol
            }, 
            process.env.JWT_SECRET, 
            {"expiresIn":"1h"}
        );

        res.status(201).json({"msj":"Inicio de session exitoso!","token":token});
    } catch (error) {
        res.status(500).json({"msj":error.msj});
    }
}

const consulta_usuario = async (req,res) => {
    try {
        const usuarios = await Usuarios.find();
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const consulta_usuario_individual = async (req,res) => {
    try {
        let nombre = req.params.nombre
        const usuarios = await Usuarios.findOne({"nombre":nombre});
        (usuarios == null) ? res.json({"msj":"Usuario no existe"}) : res.json(usuarios)
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const insercion_usuario = async (req,res) => {
    try {
        const {usuario,password,rol,estado} = req.body; //recibir datos por metodo post
        if (usuario == "" || password == "" || rol == "" || estado == "") {
            res.json({"msj":"No puedes dejar campos vacios"})
        }else {
            const usuarioNuevo = new Usuarios({"usuario":usuario,"password":password,"rol":rol,"estado":estado});
            usuarioNuevo.save();
            res.status(201).json(usuarioNuevo);
        }
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const actualizar_usuario = async (req, res) => {
    try {
        const {usuario,password,rol,estado} = req.body;
        const userParam = req.params.usuario;
        let user = await Usuarios.findOne({"nombre":userParam});
        if (user) {
            await Usuarios.updateOne({"usuario":usuario,"password":password,"rol":rol,"estado":estado});
            return res.status(200).json({"msj": "Actualización correcta"});
        } else {
            const nuevoUsuario = new Usuarios({"usuario":usuario,"password":password,"rol":rol,"estado":estado});
            await nuevoUsuario.save();
            return res.status(201).json({ msj: "El usuario no existe pero se ha creado uno nuevo" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar_usuario = async (req,res) => {
    try {
        let user = req.params.usuario;
        let userbuscar = await Usuarios.findOne({"usuario":user});
        if (userbuscar) {
            await Usuarios.deleteOne({"usuario":user});
            res.status(201).json({"msj":"Usuario eliminado"})
        }else {
            res.json({"msj":"Usuario no existe"})
        }
    } catch (error) {
        res.status(500).json({"error":error})
    }
}


export {consulta_usuario, consulta_usuario_individual,insercion_usuario, actualizar_usuario, eliminar_usuario, registro_usuario, iniciar_sesion};