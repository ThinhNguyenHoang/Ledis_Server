import express from 'express';
import controller from '../controller/commands';


const router = express.Router();

router.post('/', controller.executeCommand);
router.get('/test', controller.helloWorld);
export = router;