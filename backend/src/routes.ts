import { Router } from "express";
import classesController from "./controllers/classesController";
import connectionsController from "./controllers/connectionsController";

const routes = Router();

routes.get("/classes", classesController.index);
routes.post("/classes", classesController.create);

routes.get("/connections", connectionsController.index);
routes.post("/connections", connectionsController.create);

export default routes;
