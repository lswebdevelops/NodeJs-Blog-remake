const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

/*
 * Get/
 * HOME
 *
 */
// with pagination:

router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog Remake",
      description: "Simple Blog created with NodeJs, Express &amp; MongoDb.",
    };
    let perPage = 6;

    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

// no pagination

// router.get("/", async (req, res) => {
//     const locals = {
//         title: "NodeJs Blog Remake",
//         description: "Simple Blog created with NodeJs, Express &amp; MongoDb."
//     }

//     try {
//       const data = await Post.find();
//       res.render("index", { locals, data });

//     } catch (error) {
//       console.log(error);
//     }

// });

/*
 * Get/
 * post
 *
 */

router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express &amp; MongoDb.",
    };

    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.log(error);
  }
});

/*
 * post/
 * post searchTerm
 *
 */

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express &amp; MongoDb.",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    res.render("search", {
      locals,
      data,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "The Future of Artificial Intelligence",
//       body: "Exploring the potential impact and ethical considerations of advanced AI technologies."
//     },
//     {
//       title: "Deep Learning Demystified",
//       body: "Understanding the principles behind deep learning and neural networks in AI."
//     },
//     {
//       title: "Web Development Trends in 2023",
//       body: "A comprehensive look at the latest trends shaping the landscape of web development this year."
//     },
//     {
//       title: "The Rise of Decentralized Finance (DeFi)",
//       body: "Exploring the decentralized finance movement and its implications for traditional financial systems."
//     },
//     {
//       title: "Space Exploration in the 21st Century",
//       body: "A glimpse into the ambitious plans and technological advancements driving space exploration today."
//     },
//     {
//       title: "Sustainable Technology Innovations",
//       body: "Highlighting eco-friendly technologies that are making a positive impact on the environment."
//     },
//     {
//       title: "Cybersecurity Best Practices for Businesses",
//       body: "Guidance on implementing effective cybersecurity measures to protect businesses from digital threats."
//     },
//     {
//       title: "The Art of Storytelling in Marketing",
//       body: "Examining how storytelling can be a powerful tool in crafting compelling marketing messages."
//     },
//     {
//       title: "Advancements in Quantum Computing",
//       body: "An overview of recent breakthroughs in quantum computing and their potential applications."
//     },
//     {
//       title: "Culinary Adventures: Exploring Global Flavors",
//       body: "A journey through diverse cuisines and the unique flavors that define different cultures."
//     }
//   ]);

// }

// insertPostData();

router.get("/about", (req, res) => {
  res.render("about", {
    currentRoute: "/about",
  });
});
router.get("/contact", (req, res) => {
  res.render("contact" , {
    currentRoute: "/contact",
  });
});

module.exports = router;
