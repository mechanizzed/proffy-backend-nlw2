import express from 'express';
import ClassesController from './controllers/Classes/ClassesController';

const routes = express.Router();
const classesController = new ClassesController();

// Routes
routes.get('/', (req, res) => {
  return res.json('NLW 02 - API');
});

routes.post('/classes', classesController.create);
routes.get('/classes/filter', classesController.index);

export default routes;
