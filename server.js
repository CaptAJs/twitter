const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const { mongoURI } = require("./config/credentials");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const post = require("./routes/api/post");

const app = express();

//DB Config
const db = mongoURI;

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connect t MongoDB
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((res) => {
    console.log("mongo db connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,Authorization,X-Custom-Header"
  );
  next();
});

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", post);

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server is running at ${port}`));
