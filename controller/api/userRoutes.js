const router = require("express").Router();
const { User } = require("../../models");

//this is the basic login function which finds a user by their email
//assuming the login info is correct, it'll log them in. otherwise it'll give an error
//notice that we give the same error message for nonexistant user data and incorrect passwords for added security
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData) {
      res
        .status(404)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }
    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//this logs people out and destroys the logged_in status
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});
//this creates a new user. first it tries to find a user based off the email to check if the user already exists
//if it's new, it'll create a new user and start a session for them
router.post("/", async (req, res) => {
  const userData = await User.findOne({ where: { email: req.body.email } });
  if (userData) {
    res.status(404).json({ message: "User already exists" });
    return;
  }
  const user = await User.create(req.body);
  req.session.save(() => {
    req.session.user_id = user.id;
    req.session.logged_in = true;

    res.status(200).json({ user: user, message: "You are now logged in!" });
  });
});

module.exports = router;
