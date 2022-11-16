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
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);

//Routes
app.use("/", (req, res) => {
  res.send("Welcome to Mynventory");
});

//error middleware
app.use(errorHandler);

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
