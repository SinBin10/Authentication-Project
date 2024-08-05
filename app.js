const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const app = express();
const userSchema = require("./models/user");
const bcrypt = require("bcrypt");

//middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  let { name, email, password, age } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      console.log(hash);
      let user = await userSchema.create({
        username: name,
        email,
        password: hash,
        age,
      });
      res.send(user);
    });
  });
});

app.listen(3000);
