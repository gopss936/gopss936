var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var apiRouter = require("./routes/index");
var db = require("./models/index");
var cors = require("cors");
require("dotenv").config();

app.use(cors());

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/multiapi", apiRouter);
app.use(express.static(`${__dirname}/uploads`));

 db.mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

const port = process.env.PORT || 8090;

app.listen(port, (req, res) => {
  console.log(`server is running on port ${port}`);
});
