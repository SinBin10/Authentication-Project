const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const app = express();
const userSchema = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      let user = await userSchema.create({
        username: name,
        email,
        password: hash,
        age,
      });
      let token = jwt.sign({ email }, "shhhhhhhh");
      res.cookie(token, token);
      res.send(user);
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/userlogin", async (req, res) => {
  let user = await userSchema.findOne({ email: req.body.email });
  if (!user) return res.send("Something went wrong..");
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ email: user.email }, "shhhhhhhhh");
      res.cookie("token", token);
      return res.send("You are logged in..");
    }
    res.send("Something went wrong");
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.listen(3000);
