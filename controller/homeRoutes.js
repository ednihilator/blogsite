const router = require("express").Router();
const { Post, User, Comment } = require("../models");
//maybe use withAuth so that the "Homepage" button doesn't log you out
const withAuth = require("../utils/auth");

// Gets all posts and JOIN with user data
router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
    console.log("postdata is" + postData);
    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
    console.log(posts);
    // Pass serialized data and session flag into template
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
    console.log("get through here");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//renders the login page
router.get("/login", (req, res) => {
  res.render("login");
});
//renders the dashboard page after finding a user, and displays their posts as well
router.get("/dashboard", async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attritubte: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
        },
      ],
    });
    // const user = userData.map((user) => user.get({ plain: true }));
    const user = userData.get({ plain: true });

    res.render("dashboard", {
      ...user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//displays a post along with any comments. this requires a user to be logged in
router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
        },
      ],
    });
    const post = postData.get({ plain: true });

    res.render("post", {
      ...post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
