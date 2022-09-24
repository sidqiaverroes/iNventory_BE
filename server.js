require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const inventarisRouter = require("./routes/inventaris");

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/inventaris", inventarisRouter);

app.listen(process.env.PORT, () => console.log("Server started"));
