require("dotenv").config();

const cors = require("cors");
const bodyParser = require("body-parser");

const express = require("express");
const app = express();
const connectDB = require("./config/database");
const inventoryRoute = require("./routes/inventory");
const userRoute = require("./routes/user");
const itemRoute = require("./routes/item");
const { errorHandler } = require("./middleware/index");
const cookieParser = require("cookie-parser");

//Connect to Database
connectDB();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

//Routes
app.use("/api/auth", userRoute);
app.use("/inv", inventoryRoute);
app.use("/item", itemRoute);

//error middleware
app.use(errorHandler);

//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
