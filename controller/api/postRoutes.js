const router = require("express").Router();
const { Post } = require("../../models");

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
