"use strict";

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const taskeeRoutee = require("./routers/taskeeRouter");
const app = express();
const config = require("./config");
const db = require("./db");

db.connect(config.database);
db.setup().then(() => {
  console.log("Database is up!");

  app
    .disable("x-powered-by")
    .use(express.json())
    .use(
      cors({
        origin: '*',
        optionsSuccessStatus: 200,
      })
    )
    .use(helmet())
    .use("/", taskeeRoutee)
    .get("*", (req, res) =>
      res.status(404).json({
        status: 404,
        type: "resource",
        code: "not_found",
        message: "URI not found",
      })
    );

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
