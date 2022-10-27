import {
  ClassErrorMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
} from "@overnightjs/core";
import { NextFunction, Request, Response } from "express";
import ImageService from "./Image.service";
import { readdir } from "node:fs/promises";
import path from "path";
import multer from "multer";
import errorHandler from "../../services/errorHandler";

const pathToImages = path.join(__dirname, "../../../public/images");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pathToImages);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + `${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage }).single("file");

@Controller("api/images")
@ClassErrorMiddleware(errorHandler)
export default class ImageController {
  constructor(private service: ImageService) {}

  @Get()
  private async get(_req: Request, res: Response, next: NextFunction) {
    try {
      const files = await readdir(pathToImages);

      return res.json(files);
    } catch (error) {
      next(error);
    }
  }

  @Post("upload")
  @Middleware([upload])
  private post(req: Request, res: Response, next: NextFunction) {
    res.status(200).json(req.file.filename);
  }
}
