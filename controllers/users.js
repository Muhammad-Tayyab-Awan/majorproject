const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.registerNewUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    await User.register(newUser, password);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listing");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogInForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.LoginUser = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};

module.exports.LogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You Successfully Logged Out!");
    res.redirect("/listing");
  });
};
