require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require('express-session');

const connectDB = require("./server/config/db");

const app = express();

const cookieParser = require("cookie-parser"); 
const mongoStore = require('connect-mongo');
const MongoStore = require("connect-mongo");


const PORT = 4000 || process.env.PORT;

//connect to db
connectDB();

// search:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),

  // cookie expiration date  =>> // Date.now() - 30 * 24 * 60 * 60 *1000
  cookie: { maxAge: new Date (Date.now() + (3600000))}

}))
// public folder

app.use(express.static("public"));

// Templating engine
app.use(expressLayout);
app.set("layout", "layouts/main");

app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
