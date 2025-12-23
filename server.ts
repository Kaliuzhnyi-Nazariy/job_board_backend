import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import db from "./lib/db";
import initDB from "./lib/init_db";

const { PORT } = process.env;

db.connect()
  .then(() => {
    initDB().then(() => {
      try {
        app.listen(PORT, () => console.log("server is running"));
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.log("DB connection error: ", err);
  });
