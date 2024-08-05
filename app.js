const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const app = express();
const userSchema = require("./models/user");

//middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {
  let { name, email, password, age } = req.body;
  let user = await userSchema.create({
    username: name,
    email,
    password,
    age,
  });
  res.send(user);
});

app.listen(3000);
