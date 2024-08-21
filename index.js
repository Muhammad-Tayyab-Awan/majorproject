if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const server = require("express");
let app = server();
const mongoose = require("mongoose");
const path = require("path");
const method = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

const DB_URL = process.env.MONGO_ATLAS_DB_URL;
const port = 8080;

const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600
});

main()
  .then(() => {
    console.log("DB Connection Established");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(DB_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(server.urlencoded({ extended: true }));
app.use(method("_method"));
app.engine("ejs", ejsMate);
app.use(server.static(path.join(__dirname, "public")));

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

app.get("/", (req, res) => {
  res.redirect("/listing");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.use("/listing", listingRoute);
app.use("/listing/:id/reviews", reviewRoute);
app.use("/", userRoute);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("./error.ejs", { message });
});
//listing to port
app.listen(port, () => {
  console.log(`Server is Running on http://localhost:${port}`);
});
