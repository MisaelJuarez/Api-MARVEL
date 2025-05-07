import Guardianes from '../models/Guardianes.js';

const consulta_guardianes = async (req,res) => {
    try {
        const superheroes = await Guardianes.find();
        res.json(superheroes);
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const consulta_guardian_individual = async (req,res) => {
    try {
        let nombre = req.params.nombre
        const superheroe = await Guardianes.findOne({"alias":nombre});
        (superheroe == null) ? res.json({"msj":"Superheroe no encontrado"}) : res.json(superheroe)
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const insercion_guardian = async (req,res) => {
    try {
        const {alias,nombre,poder,categoria,nivel_amenaza,url} = req.body;
        if(res.user.rol !== 1) return res.status(403).json({"msj":"No tienes permisos para efectuar esta accion"}); 

        if (alias == "" || nombre == "" || poder == "" || categoria == "" || nivel_amenaza == "",url == "") {
            res.json({"msj":"No puedes dejar campos vacios"})
        }else {
            const superNuevo = new Guardianes({"alias":alias,"nombre":nombre,"poder":poder,"categoria":categoria,"nivel_amenaza":nivel_amenaza,"url":url});
            superNuevo.save();
            res.status(201).json(superNuevo);
        }
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

const actualizar_guardian = async (req, res) => {
    try {
        const {alias,nombre,poder,categoria,nivel_amenaza,url} = req.body;
        if(res.user.rol !== 1) return res.status(403).json({"msj":"No tienes permisos para efectuar esta accion"}); 

        const superParam = req.params.superheroe;
        let superheroe = await Guardianes.findOne({"alias":superParam});
        if (superheroe) {
            await Guardianes.updateOne({"alias":superParam},{$set: {"alias":alias,"nombre":nombre,"poder":poder,"categoria":categoria,"nivel_amenaza":nivel_amenaza,"url":url}});
            return res.status(200).json({"msj": "Actualización correcta"});
        } else {
            const nuevoSuper = new Guardianes({"alias":alias,"nombre":nombre,"poder":poder,"categoria":categoria,"nivel_amenaza":nivel_amenaza,"url":url});
            await nuevoSuper.save();
            return res.status(201).json({ msj: "El superheroe no existe pero se ha creado uno nuevo" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar_guardian = async (req,res) => {
    try {
        if(res.user.rol !== 1) return res.status(403).json({"msj":"No tienes permisos para efectuar esta accion"}); 
        let superheroe = req.params.superheroe;
        let superbuscar = await Guardianes.findOne({"alias":superheroe});
        if (superbuscar) {
            await Guardianes.deleteOne({"alias":superheroe});
            res.status(201).json({"msj":"Superheroe eliminado"})
        }else {
            res.json({"msj":"Superheroe no existe"})
        }
    } catch (error) {
        res.status(500).json({"error":error})
    }
}

export {consulta_guardianes, consulta_guardian_individual,insercion_guardian, actualizar_guardian, eliminar_guardian};