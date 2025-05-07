// npm i jsonwebtoken bcryptjs
import { Router } from 'express';
import { actualizar_usuario, consulta_usuario, consulta_usuario_individual, eliminar_usuario, insercion_usuario, registro_usuario, iniciar_sesion } from '../controllers/Usuarios.controller.js';
import { actualizar_vengador, consulta_vengadores, consulta_vengador_individual, eliminar_vengador, insercion_vengador } from '../controllers/Vengadores.controller.js';
import { actualizar_xmen, consulta_xmen, consulta_xmen_individual, eliminar_xmen, insercion_xmen } from '../controllers/Xmen.controller.js';
import { actualizar_guardian, consulta_guardian_individual, consulta_guardianes, eliminar_guardian, insercion_guardian } from '../controllers/Guardianes.controller.js';
import authMiddleware from '../config/authMiddleware.js';

const router = Router();

router.get("/usuario/:nombre",consulta_usuario_individual);
router.post("/insercion_usuario/",insercion_usuario);
router.put("/actualizar_usuario/:nombre",actualizar_usuario);
router.delete("/eliminar_usuario/:nombre",eliminar_usuario);

router.get("/usuarios",consulta_usuario);
router.post("/registro/",registro_usuario);
router.post("/login/",iniciar_sesion);

router.get("/vengadores",consulta_vengadores);
router.get("/vengadores/:nombre",consulta_vengador_individual);
router.post("/vengadores/insercion",authMiddleware,insercion_vengador);
router.put("/vengadores/actualizar/:superheroe",authMiddleware,actualizar_vengador);
router.delete("/vengadores/eliminar/:superheroe",authMiddleware,eliminar_vengador);

router.get("/xmen",consulta_xmen);
router.get("/xmen/:nombre",consulta_xmen_individual);
router.post("/xmen/insercion/",authMiddleware,insercion_xmen);
router.put("/xmen/actualizar/:superheroe",authMiddleware,actualizar_xmen);
router.delete("/xmen/eliminar/:superheroe",authMiddleware,eliminar_xmen);

router.get("/guardianes",consulta_guardianes);
router.get("/guardianes/:nombre",consulta_guardian_individual);
router.post("/guardianes/insercion/",authMiddleware,insercion_guardian);
router.put("/guardianes/actualizar/:superheroe",authMiddleware,actualizar_guardian);
router.delete("/guardianes/eliminar/:superheroe",authMiddleware,eliminar_guardian);



router.use((req,res) => {
    res.status(404).json({
        "estatus": "error",
        "msj":"ruta no encontrada"
    });
});

export default router;