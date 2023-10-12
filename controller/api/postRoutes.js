const router = require("express").Router();
const { Post } = require("../../models");

// this function creates a new post attached to a user's id
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    return res.status(200).json(newPost);
  } catch (err) {
    throw err;
  }
});
// this function destroys a post grabbing it from a users id. the if statement checks to see if posts exists and will delete or output an error
router.delete("/:id", async (req, res) => {
  const postData = await Post.destroy({ where: { id: req.params.id } });
  if (postData[0] > 0) {
    res.status(200).end();
  } else if (!postData) {
    res.status(400).json({ message: "Post not found" });
  } else {
    res.status(500).json({ message: "Server Error!" });
  }
});

module.exports = router;
