import {Router} from 'express';
import passport from 'passport';
import {uploader} from '../utils.js';
import sessionsController from '../controllers/sessions.controller.js';
const router = Router();

router.post('/register',uploader.single('photo'),passport.authenticate('register',{failureRedirect:'/api/sessions/registerfail'}),sessionsController.register);
router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/loginfail'}),sessionsController.login);
router.get('/loginfail',sessionsController.loginfail);
router.get('/registerfail',sessionsController.registerfail)

export default router;