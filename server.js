require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const PORT = 2468;
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Serve FrontEnd
app.use(express.static(path.join(__dirname, "public")));

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/myFirstDB");
    console.log("DB Connected");
  } catch (err) {
    console.error(err.message);
  }
};
connectDB();

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
require("crypto").randomBytes(32).toString("hex");
