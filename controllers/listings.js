const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const mpbxClient = mbxGeocoding({ accessToken: mapToken });
const { countries } = require("../public/js/countries.js");

module.exports.index = async (req, res, next) => {
  let listingDB = await Listing.find({});
  res.render("./listing/index.ejs", { listingDB });
};

module.exports.renderNewListingForm = (req, res) => {
  res.render("./listing/newlisting.ejs", { countries });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let singleListing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!singleListing) {
    req.flash("error", "Listing You Requested is Not Found!");
    res.redirect("/listing");
  }
  res.render("./listing/showlisting.ejs", { singleListing });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let response = await mpbxClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  listing.geometry = response.body.features[0].geometry;
  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listing");
};

module.exports.renderEditListingForm = async (req, res) => {
  let { id } = req.params;
  let editListing = await Listing.findById(id);
  if (!editListing) {
    req.flash("error", "Listing You Requested is Not Found!");
    res.redirect("/listing");
  }
  res.render("./listing/editlisting.ejs", { editListing, countries });
};

module.exports.createListing = async (req, res, next) => {
  let response = await mpbxClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  let addListing = new Listing(req.body.listing);
  addListing.owner = req.user._id;
  addListing.image = { url, filename };
  addListing.geometry = response.body.features[0].geometry;
  await addListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listing");
};
