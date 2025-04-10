var createError = require("http-errors");
var express = require("express");


// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = "mongodb://psi042:psi042@0.0.0.0:27017/psi042?retryWrites=true&authSource=psi042";
//"mongodb://psi042:psi042@0.0.0.0:27017/psi042?retryWrites=true&authSource=psi042";
//"mongodb+srv://franciscomoz:pHSB9pEt2vzOrvjE@cluster0.r3cn25x.mongodb.net/psi_04?retryWrites=true&w=majority&appName=Cluster0";
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");

var app = express();
var cors = require("cors");
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
