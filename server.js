const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DATABASE CONNECTED"))
    .catch((err) => console.log("ERORR IN CONNECTING DATABASE", err.message));


port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));