const path = require("path");
const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./server/config/database");
const mainRoutes = require("./server/routes/main");
const postRoutes = require("./server/routes/posts");
const lossEventRoutes = require("./server/routes/lossEvents");


//Use .env file in config folder
require("dotenv").config({ path: "./server/config/.env" });

// Passport config
require("./server/config/passport")(passport);

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    console.error("SESSION_SECRET must be set in production");
    process.exit(1);
}

//Connect To Database
connectDB();

//cors
app.use(cors())

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://localhost:3000")
//     res.header("Access-Control-Allow-Headers", "https://localhost:3000")
//     next()
// });

//Static Folder
app.use(express.static("public"));

//In production Express also serves the React build. Some client pages share a path with an
//API route (/feed, /login, /signup, /post/:id), so browser page loads (Accept: text/html) get
//index.html and fetch() calls fall through to the API.
if (process.env.NODE_ENV === "production") {
    const clientBuild = path.join(__dirname, "client/build");
    app.use(express.static(clientBuild));
    app.get("*", (req, res, next) => {
        if (req.accepts(["json", "html"]) === "html") {
            return res.sendFile(path.join(clientBuild, "index.html"));
        }
        next();
    });
}

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "keyboard cat",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/lossEvent", lossEventRoutes);


//Server Running
app.listen(process.env.PORT, () => {
    console.log("Server is running, you better catch it!");
});
  