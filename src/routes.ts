import express from 'express';
import ClassesController from './controllers/Classes/ClassesController';
import ConnectionsController from './controllers/Connections/ConnectionsController';

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

// initial
routes.get('/', (req, res) => {
  return res.json('NLW 02 - API');
});

// classes
routes.post('/classes', classesController.create);
routes.get('/classes/filter', classesController.index);

// connections
routes.post('/connections', connectionsController.create);
routes.get('/connections/list', connectionsController.index);
export default routes;
