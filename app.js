import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import PlacesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";
import HttpError from "./models/http-error.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/places", PlacesRoutes);
app.use("/api/users", usersRoutes);
app.use((req, res, next) => {
  throw new HttpError("Couldn't find requested page", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "A unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://beereshbc:beereshbc@backenddb.wcm3b.mongodb.net/places"
  )
  .then(() => {
    app.listen(5000);
    console.log("DB connected Successfully");
  })
  .catch((error) => {
    console.log(error);
  });
