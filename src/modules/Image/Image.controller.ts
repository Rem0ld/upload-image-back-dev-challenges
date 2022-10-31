import {
  ClassErrorMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
} from "@overnightjs/core";
import { Request, Response } from "express";
import path from "path";
import multer from "multer";
import errorHandler from "../../services/errorHandler";

const authorizedfile = ["jpeg", "jpg", "png", "gif"];
const MAX_SIZE = 1048576;

const pathToImages = path.join(__dirname, "../../../public/images");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { mimetype } = file;
    if (+req.headers["content-length"] > MAX_SIZE) {
      cb(
        new Error(
          `Maximum file size is ${Math.floor(MAX_SIZE / 1024 / 1000)} mb`
        ),
        pathToImages
      );
      return;
    }
    if (
      !authorizedfile.includes(mimetype.substring(mimetype.indexOf("/") + 1))
    ) {
      console.log("here");
      cb(
        new Error(`file accepted are ${authorizedfile.join(", ")}`),
        pathToImages
      );
      return;
    }
    cb(null, pathToImages);
    return;
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + `${path.extname(file.originalname)}`
    );
    return;
  },
});
const upload = multer({ storage, limits: { fieldSize: MAX_SIZE } }).single(
  "file"
);

@Controller("api/images")
@ClassErrorMiddleware(errorHandler)
export default class ImageController {
  constructor() {}

  @Get("health")
  private getHealth(req: Request, res: Response) {
    res.status(200).json("ok");
    return;
  }

  @Post("upload")
  @Middleware([upload])
  private post(req: Request, res: Response) {
    res.status(200).json(req.file.filename);
    return;
  }
}
