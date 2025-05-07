import Xmen from "../models/Xmen.js";

const consulta_xmen = async (req,res) => {
    try {
        const superheroe = await Xmen.find();
        res.json(superheroe);
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const consulta_xmen_individual = async (req,res) => {
    try {
        let nombre = req.params.nombre
        const superheroe = await Xmen.findOne({"alias":nombre});
        (superheroe == null) ? res.json({"msj":"Superheroe no encontrado"}) : res.json(superheroe)
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const insercion_xmen = async (req,res) => {
    try {
        const {alias,nombre,poder,categoria,nivel_amenaza,url} = req.body;
        if(res.user.rol !== 1) return res.status(403).json({"msj":"No tienes permisos para efectuar esta accion"}); 

        if (alias == "" || nombre == "" || poder == "" || categoria == "" || nivel_amenaza == "" || url == "") {
            res.json({"msj":"No puedes dejar campos vacios"})
        }else {
            const superNuevo = new Xmen({"alias":alias,"nombre":nombre,"poder":poder,"categoria":categoria,"nivel_amenaza":nivel_amenaza,"url":url});
            superNuevo.save();
            res.status(201).json(superNuevo);
        }
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const actualizar_xmen = async (req, res) => {
    try {
        const {alias,nombre,poder,categoria,nivel_amenaza,url} = req.body;
        if(res.user.rol !== 1) return res.status(403).json({"msj":"No tienes permisos para efectuar esta accion"}); 

        const superParam = req.params.superheroe;
        let superheroe = await Xmen.findOne({"alias":superParam});
        if (superheroe) {
            await Xmen.updateOne({"alias":superParam},{$set: {"alias":alias,"nombre":nombre,"poder":poder,"categoria":categoria,"nivel_amenaza":nivel_amenaza,"url":url}});
            return res.status(200).json({"msj": "Actualización correcta"});
        } else {
            const nuevoSuper = new Xmen({"alias":alias,"nombre":nombre,"poder":poder,"categoria":categoria,"nivel_amenaza":nivel_amenaza,"url":url});
            await nuevoSuper.save();
            return res.status(201).json({ msj: "El superheroe no existe pero se ha creado uno nuevo" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar_xmen = async (req,res) => {
    try {
        if(res.user.rol !== 1) return res.status(403).json({"msj":"No tienes permisos para efectuar esta accion"}); 
        let superheroe = req.params.superheroe;
        let superbuscar = await Xmen.findOne({"alias":superheroe});
        if (superbuscar) {
            await Xmen.deleteOne({"alias":superheroe});
            res.status(201).json({"msj":"Superheroe eliminado"})
        }else {
            res.json({"msj":"Superheroe no existe"})
        }
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

export {consulta_xmen, consulta_xmen_individual,insercion_xmen, actualizar_xmen, eliminar_xmen};