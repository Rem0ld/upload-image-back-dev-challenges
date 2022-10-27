import MyServer from "./src/config/server";
import { logger } from "./src/utils/logger/logger";

const port = process.env.PORT || "3000";
const server = new MyServer();

(async () => {
  try {
    server.start(port);
  } catch (error) {
    logger.error("Cannot start db", error);
  }
})();
