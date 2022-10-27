import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

import { Server } from "@overnightjs/core";
import { logger } from "../utils/logger/logger";

export default class MyServer extends Server {
  constructor() {
    super(process.env.NODE_ENV === "development");
    dotenv.config();
    this.showLogs = true;
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("combined"));
    this.setupController();
  }

  private setupController(): void {
    logger.info("Setting up controllers");
    // super.addControllers(routes);
  }

  public start(port: string): void {
    this.app.listen(port, () => {
      logger.info(`Listening on ${port}`);
      logger.info(`Environment is ${process.env.NODE_ENV}`);
    });
  }
}
