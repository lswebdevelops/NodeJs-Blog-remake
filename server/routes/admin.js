const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

/*
 *
 *  check login
 *
 */

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userID;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

/*
 * get/
 *  admin - login page
 *
 */

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express &amp; MongoDb.",
    };

    res.render("admin/login", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/*
 * post/
 *  admin - check login
 *
 */
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userID: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/*
 * get/
 * admin  dashboard -
 *
 */

router.get("/dashboard", authMiddleware, async (req, res) => {

    try {
    
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals, 
            data
        })
    } catch (error) {
        
    }






  res.render("admin/dashboard");
});








// router.post("/admin", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     // console.log(req.body);

//     if (req.body.username === "admin" && req.body.password === "password") {
//       res.send("you are loging in");
//     }else{
//         res.send('false!! ');
//     }

//     //   res.render("admin/login", { locals , layout: adminLayout });
//   } catch (error) {
//     console.log(error);
//   }
// });

/*
 * post/
 * admin / register
 *
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (req.body.username === "admin") {
      res.send("user creation not allowed");
      return; // stop program
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
