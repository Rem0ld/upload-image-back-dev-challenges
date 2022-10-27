import ImageController from "./Image.controller";
import ImageService from "./Image.service";

const service = new ImageService();
const controller = new ImageController(service);

export default controller;
