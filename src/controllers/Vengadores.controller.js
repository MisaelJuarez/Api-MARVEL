import Vengadores from '../models/Vengadores.js';

const consulta_vengadores = async (req,res) => {
    try {
        const superheroes = await Vengadores.find();
        res.json(superheroes);
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const consulta_vengador_individual = async (req,res) => {
    try {
        let nombre = req.params.nombre
        const superheroe = await Vengadores.findOne({"alias":nombre});
        (superheroe == null) ? res.json({"msj":"Superheroe no encontrado"}) : res.json(superheroe)
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const insercion_vengador = async (req,res) => {
    try {
        const {alias,nombre,poder,categoria,nivel_amenaza,url} = req.body;
        if(res.user.rol !== 1) return res.status(403).json({"msj":"No tienes permisos para efectuar esta accion"}); 
        
        if (alias == "" || nombre == "" || poder == "" || categoria == "" || nivel_amenaza == "" || url == "") {
            res.json({"msj":"No puedes dejar campos vacios"});
        }else {
            const superNuevo = new Vengadores({"alias":alias,"nombre":nombre,"poder":poder,"categoria":categoria,"nivel_amenaza":nivel_amenaza,"url":url});
            superNuevo.save();
            res.status(201).json(superNuevo);
        }
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const actualizar_vengador = async (req, res) => {
    try {
        const {alias,nombre,poder,categoria,nivel_amenaza,url} = req.body;
        if(res.user.rol !== 1) return res.status(500).json({"msj":"No tienes permisos para efectuar esta accion"}); 
        const superParam = req.params.superheroe;
        let superheroe = await Vengadores.findOne({"alias":superParam});
        if (superheroe) {
            await Vengadores.updateOne({"alias":superParam},{$set: {"alias":alias,"nombre":nombre,"poder":poder,"categoria":categoria,"nivel_amenaza":nivel_amenaza,"url":url}});
            return res.status(200).json({"msj": "Actualización correcta"});
        } else {
            const nuevoSuper = new Vengadores({"alias":alias,"nombre":nombre,"poder":poder,"categoria":categoria,"nivel_amenaza":nivel_amenaza,"url":url});
            await nuevoSuper.save();
            return res.status(201).json({ msj: "El superheroe no existe pero se ha creado uno nuevo" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar_vengador = async (req,res) => {
    try {
        if(res.user.rol !== 1) return res.status(500).json({"msj":"No tienes permisos para efectuar esta accion"}); 
        let superheroe = req.params.superheroe;
        let superbuscar = await Vengadores.findOne({"alias":superheroe});
        if (superbuscar) {
            await Vengadores.deleteOne({"alias":superheroe});
            res.status(201).json({"msj":"Superheroe eliminado"})
        }else {
            res.json({"msj":"Superheroe no existe"})
        }
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

export {consulta_vengadores, consulta_vengador_individual,insercion_vengador, actualizar_vengador, eliminar_vengador};