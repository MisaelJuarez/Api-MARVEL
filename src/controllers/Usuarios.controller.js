import Usuarios from '../models/Usuarios.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const registro_usuario = async (req,res) => {
    try {
        let rol = req.params.rol;

        if (rol == 1) {
            const {usuario, password,rol} = req.body;
            const verificarUsuario = await Usuarios.findOne({"usuario":usuario});
            if (verificarUsuario) return res.status(500).json({"msj":`El usuario ${usuario} ya esta registrado`,"icon":"error","status":false});
            const cifrado = await bcrypt.hash(password,10);
            const registro = new Usuarios({"usuario":usuario,"password":cifrado,"rol":rol,"estado":2,"cuenta":1});
            await registro.save();
            res.status(201).json({"msj":"Usuario registrado, correctamente","icon":"success","status":true})
        } else if(rol == 2){
            const {usuario, password} = req.body;
            const verificarUsuario = await Usuarios.findOne({"usuario":usuario});
            if (verificarUsuario) return res.status(500).json({"msj":`El usuario ${usuario} ya esta registrado`,"icon":"error","status":false});
            const cifrado = await bcrypt.hash(password,10);
            const registro = new Usuarios({"usuario":usuario,"password":cifrado,"rol":2,"estado":2,"cuenta":1});
            await registro.save();
            res.status(201).json({"msj":"Usuario registrado, ya puedes inicar sesion","icon":"success","status":true})
        }

    } catch (error) {   
        req.status(500).json({"msj":error.msj});
    }
}

const iniciar_sesion = async (req,res) => {
    try {
        const {usuario, password} = req.body;
        const consutaUsario = await Usuarios.findOne({"usuario":usuario});
        if (!consutaUsario) return res.status(500).json({"msj":`El usuario ${usuario} no esta registrado`,"icon":"warning"});
        let comparacion = await bcrypt.compare(password,consutaUsario.password);
        if(!comparacion) return res.status(500).json({"msj":"Credenciales de acceso no validas!","icon":"error"});
        if(consutaUsario.cuenta === 2) return res.status(500).json({"msj":"Tu cuenta ha sido desactivada!","icon":"warning"});
        const token = jwt.sign(
            {
                "id":consutaUsario._id,
                "rol":consutaUsario.rol
            }, 
            process.env.JWT_SECRET, 
            {"expiresIn":"1h"}
        );

        res.status(201).json({"msj":"Bienvenido acceso otorgado!","icon":"success","token":token,"user_data":consutaUsario});
    } catch (error) {
        res.status(500).json({"msj":error.msj});
    }
}

const consulta_usuario = async (req,res) => {
    try {
        let nombre = req.params.nombre;
        const usuarios = await Usuarios.find({"usuario":{$ne:nombre}});
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const consulta_usuario_individual = async (req,res) => {
    try {
        let nombre = req.params.nombre;
        const usuarios = await Usuarios.findOne({"usuario":nombre});
        (usuarios == null) ? res.json({"msj":"Usuario no existe"}) : res.json(usuarios)
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const actualizar_usuario = async (req, res) => {
    try {
        const {usuario,password,rol,cuenta} = req.body;
        const userParam = req.params.nombre;
        let user = await Usuarios.findOne({"usuario":userParam});
        if (user) {

            if (password == '') {
                await Usuarios.updateOne({"usuario":userParam},{$set:{"usuario":usuario,"rol":rol,"cuenta":cuenta}});
                return res.status(200).json({"msj": "Actualización correcta","icon":"success"});
            }else {
                const cifrado = await bcrypt.hash(password,10);
                await Usuarios.updateOne({"usuario":userParam},{$set:{"usuario":usuario,"password":cifrado,"rol":rol,"cuenta":cuenta}});
                return res.status(200).json({"msj": "Actualización correcta","icon":"success"});
            }

        } else {
            return res.status(201).json({"msj":"El usuario no esta registrado","icon":"error"});
        }
    } catch (error) {
        res.status(500).json({"msj":error.message,"icon":"error"});
    }
};

const eliminar_usuario = async (req,res) => {
    try {
        let user = req.params.nombre;
        let userbuscar = await Usuarios.findOne({"usuario":user});
        if (userbuscar) {
            await Usuarios.deleteOne({"usuario":user});
            res.status(201).json({"msj":"Usuario eliminado","icon":"success"})
        }else {
            res.json({"msj":"Usuario no existe","icon":"error"})
        }
    } catch (error) {
        res.status(500).json({"msj":error,"icon":"error"})
    }
}

const manejar_estado = async (req,res) => {
    try {
        const {estado} = req.body;
        const userParam = req.params.nombre;
        
        await Usuarios.updateOne({"usuario":userParam},{$set:{"estado":estado}});
        return res.status(200).json({"msj": `estado cambiado ${estado}`});
       

    } catch (error) {
        res.status(500).json({"msj":error.message});
    }
}

export {consulta_usuario, consulta_usuario_individual, actualizar_usuario, eliminar_usuario, registro_usuario, iniciar_sesion, manejar_estado};