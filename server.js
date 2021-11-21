require("dotenv").config();
const express = require("express"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    session = require("express-session"),
    cookieParser = require("cookie-parser"),
    routes = require("./routes/index");

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DATABASE CONNECTED"))
    .catch((err) => console.log("ERROR IN CONNECTING DATABASE", err.message));

const app = express();

// view engine
app.set("view engine", "ejs");

// middleware
// app.use(require("morgan")());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

//connect-flash
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    cookie: { maxAge: 60000 },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// routes
app.use("/", routes);

port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));