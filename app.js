const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const app = express();
const userSchema = require("./models/user");
const postSchema = require("./models/post");
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

app.get("/create", async (req, res) => {
  let user = await userSchema.create({
    username: "Binay",
    email: "binay@gmail.com",
    age: 34,
  });
  res.send(user);
});

app.get("/create/post", async (req, res) => {
  let post = await postSchema.create({
    postdata: "This is my post guyys",
    user: "66b1c3233c67bdb53b0cdb74",
  });
  let user = await userSchema.findOne({ _id: "66b1c3233c67bdb53b0cdb74" });
  user.posts.push(post._id);
  await user.save();
  res.send({ user, post });
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
