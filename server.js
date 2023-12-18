const express = require("express");
const mongoose = require("mongoose");
const User = require("./userModel.js");
const Art = require("./artModel.js");
const Artists = require("./artistsModel.js");

const app = express();

let loggedInUsers = [];

app.use(express.static("public"));
app.use(express.json());
app.set("views", "public");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/user", (req, res) => {
  res.render("user");
});

app.get("/artistUser", (req, res) => {
  res.render("artistUser");
});

app.get("/upload", (req, res) => {
  res.render("uploadArt");
});

app.get("/addWorkshop", (req, res) => {
  res.render("addWorkshop");
});

app.get("/notifications", (req, res) => {
  res.render("notifications");
});

app.get("/search", (req, res) => {
  res.render("search");
});

app.get("/viewLiked", (req, res) => {
  res.render("viewLiked");
});

app.get("/switchToArtist", (req, res) => {
    res.render("patronSwitch");
});

app.get("/switchToPatron", (req, res) => {
    res.render("artistSwitch");
});

app.get("/following", (req, res) => {
  res.render("following");
});

app.get("/getFollowing/:id", async (req, res) => {
  let userID = req.params.id;

  if (userID == null) {
    res.status(400).send("No UserID provided");
    return;
  }

  if (!loggedInUsers.includes(userID)) {
    res.status(400).send("User is not logged in");
    return;
  }

  let userData = await User.findById(userID);

  if (userData == null) {
    res.status(404).send("User not found");
    return;
  }

  let following = userData.following;

  res.status(200).send(following);
});

app.get("/getLiked/:id", async (req, res) => {
  let userID = req.params.id;

  if (userID == null) {
    res.status(400).send("No UserID provided");
    return;
  }

  if (!loggedInUsers.includes(userID)) {
    res.status(400).send("User is not logged in");
    return;
  }

  let userData = await User.findById(userID);

  if (userData == null) {
    res.status(400).send("User not found");
    return;
  }

  let liked = userData.liked;

  res.status(200).send(liked);
});

app.put("/logout/:id", (req, res) => {
  let userID = req.params.id;

  if (userID == null) {
    res.status(400).send("No UserID provided");
    return;
  }

  if (!loggedInUsers.includes(userID)) {
    res.status(400).send("User is not logged in");
    return;
  }

  loggedInUsers.splice(loggedInUsers.indexOf(userID), 1);

  res.status(200).send("Logout successful!");
});

app.put("/follow/:userID/:artistName", async (req, res) => {
  let userID = req.params.userID;
  let artistName = req.params.artistName;

  if (userID == null) {
    res.status(400).send("No UserID provided");
    return;
  }

  if (artistName == null) {
    res.status(400).send("No artistName provided");
    return;
  }

  if (!loggedInUsers.includes(userID)) {
    res.status(400).send("User is not logged in");
    return;
  }

  let requestedUser = await User.findById(userID);

  if (requestedUser == null) {
    res.status(400).send("User not found");
    return;
  }

  let requestedArtist = await Artists.find({ Artist: artistName });

  if (requestedArtist == null) {
    res.status(400).send("Artist not found");
    return;
  }

  // Check if user is already following artist
  if (requestedUser.following.includes(artistName)) {
    console.log("User is already following artist... Unfollowing...");
    requestedUser.following.splice(
      requestedUser.following.indexOf(artistName),
      1
    );
    requestedUser.save();
    res.status(200).send("Unfollow successful!");
    return;
  }

  requestedUser.following.push(artistName);
  requestedUser.save();

  res.status(200).send("Follow successful!");
});

app.get("/artSearch", parseSearch, loadSearch, sendSearch);

function parseSearch(req, res, next) {
  console.log("Parse Query");
  let matches = [];

  if (req.query.title) {
    matches.push({
      Title: { $regex: ".*" + req.query.title + ".*", $options: "i" },
    });
  }
  if (req.query.artist) {
    matches.push({
      Artist: { $regex: ".*" + req.query.artist + ".*", $options: "i" },
    });
  }
  if (req.query.category) {
    matches.push({
      Category: { $regex: ".*" + req.query.category + ".*", $options: "i" },
    });
  }

  let queryDoc = { $and: matches };

  req.queryDoc = queryDoc;
  next();
}

async function loadSearch(req, res, next) {
  console.log("loadSearch");
  let query = req.queryDoc;
  console.log("Query " + JSON.stringify(req.queryDoc));
  const searchResults = await Art.find(query);
  console.log(searchResults);
  res.results = searchResults;
  next();
}

function sendSearch(req, res, next) {
  console.log("Send Search");
  res.status(200).render("searchResults", { artList: res.results });
}

app.get("/art/:id", (req, res) => {
  Art.findById(req.params.id)
    .then((result) => {
      console.log("result:" + result);
      res.render("art", { art: result });
    })
    .catch((error) => {
      res.status(404).send("Art not found");
    });
});

app.get("/artByName/:name", (req, res) => {
    Art.find({ Title: req.params.name })
        .then((result) => {
            let resultJSON = JSON.stringify(result);
            console.log("result:" + resultJSON);
            resultJSON = JSON.parse(resultJSON)[0];
            res.render("art", { art: resultJSON });
        })
        .catch((error) => {
        res.status(404).send("Art not found");
        });
});

app.get("/artists/:name", (req, res) => {
    Artists.find({ Artist: req.params.name })
        .then((result) => {
            let resultJSON = JSON.stringify(result);
            console.log("result:" + resultJSON);
            resultJSON = JSON.parse(resultJSON)[0];
            res.render("artists", { artist: resultJSON });
        })
        .catch((error) => {
            console.error(error);
        res.status(404).send("Artist not found");
        });
});

app.put("/Art/:userID/:artID", async (req, res) => {
  // increment number of likes by 1
  console.log("likeArt");

  artID = req.params.artID;
  userID = req.params.userID;

  if (artID == null) {
    res.status(400).send("No artID provided");
    return;
  }

  if (userID == null) {
    res.status(400).send("No userID provided");
    return;
  }

  if (!loggedInUsers.includes(userID)) {
    res.status(400).send("User is not logged in");
    return;
  }

  // Get user from database
  let user = await User.findById(userID);

  if (user == null) {
    res.status(400).send("User not found");
    return;
  }

  // Get art from database
  let desiredArt = await Art.findById(artID);

  if (desiredArt == null) {
    res.status(400).send("Art not found");
    return;
  }

  // Check if user has already liked the art
  if (user.liked.includes(desiredArt.Title)) {
    console.log("User has already liked this art... Unliking...");
    user.liked.splice(user.liked.indexOf(desiredArt.Title), 1);
    user.save();

    // Decrement art's likes by 1
    desiredArt.Likes -= 1;
    desiredArt.save();

    res.status(200).send("Like successfully removed!");
    return;
  }

  console.log("User has not liked this art yet... Liking...");

  // Add art to user's liked array
  user.liked.push(desiredArt.Title);
  user.save();

  // Increment art's likes by 1
  desiredArt.Likes += 1;
  desiredArt.save();

  res.status(200).send("Like successful!");
});

app.get("/artist/:id", (req, res) => {
  Artists.findById(req.params.id)
    .then((result) => {
      res.render("artist", { artist: result });
    })
    .catch((error) => {
      res.status(404).send("Artist not found");
    });
});

app.get("/getReviews/:artID", async (req, res) => {
  let artID = req.params.artID;

  if (artID == null) {
    res.status(400).send("No artID provided");
    return;
  }

  let artData = await Art.findById(artID);

  if (artData == null) {
    res.status(404).send("Art not found");
    return;
  }

  res.status(200).send(artData.Reviews);
});

app.post("/reviewArt/:userID/:artID", async (req, res) => {
  let artID = req.params.artID;
  let userID = req.params.userID;

  if (artID == null) {
    res.status(400).send("No artID provided");
    return;
  }

  if (userID == null) {
    res.status(400).send("No userID provided");
    return;
  }

  if (!loggedInUsers.includes(userID)) {
    res.status(400).send("User is not logged in");
    return;
  }

  // Get user from database
  let userData = await User.findById(userID);

  if (userData == null) {
    res.status(404).send("User not found");
    return;
  }

  // Get art from database
  let artData = await Art.findById(artID);

  if (artData == null) {
    res.status(404).send("Art not found");
    return;
  }

  // Check if user has already reviewed the art
  for (const review of userData.reviews) {
    let artSplit = review.split("|");
    let artTitle = artSplit[0];
    let artReview = artSplit[1];

    if (artTitle == artData.Title) {
      console.log("User has already reviewed this art... Removing review...");

      userData.reviews.splice(userData.reviews.indexOf(review), 1);
      userData.save();

      artData.Reviews.splice(artData.Reviews.indexOf(review), 1);
      artData.save();

      res.status(200).send("Review successfully removed!");
      return;
    }
  }

  let review = `${artData.Title}|${req.body.review}`;
  userData.reviews.push(review);
  userData.save();

  artData.Reviews.push(review);
  artData.save();

  res.status(200).send("Review successful!");
});

app.post("/switchToPatron/:id", async (req, res) => {
  let userID = req.params.id;

  if (userID == null) {
    res.status(400).send("No UserID provided");
    return;
  }

  if (!loggedInUsers.includes(userID)) {
    res.status(400).send("User is not logged in");
    return;
  }

  let userData = await User.findById(userID);

  if (userData == null) {
    res.status(404).send("User not found");
    return;
  }

  userData.Artists = false;
  userData.save();
  console.log(userData);

  res.status(200).send("Switched to patron!");
});

app.post("/postArt/:id", async (req, res) => {
  /*
  Expected body:
    {
      title: "title",
      year: "year",
      category: "category",
      medium: "medium",
      description: "description",
      poster: "poster"
    }
  */

  let userID = req.params.id;

  if (userID == null) {
    res.status(400).send("No UserID provided");
    return;
  }

  if (!loggedInUsers.includes(userID)) {
    res.status(400).send("User is not logged in");
    return;
  }

  let userData = await User.findById(userID);
  if (userData == null) {
    res.status(404).send("User not found");
    return;
  }

  console.log(req.body);

  let art = new Art();
  art.Title = req.body.title;
  art.Year = req.body.year;
  art.Category = req.body.category;
  art.Medium = req.body.medium;
  art.Description = req.body.description;
  art.Poster = req.body.poster;
  art.Artist = userData.username;
  art.Likes = 0;
  art.Reviews = [];

  art.save()

  let artists = await Artists.find({ Artist: userData.username });
  console.log("ARTIST:");
  console.log(artists);

  if (artists.length == 0) {
    artist = new Artists();
    artist.Artist = userData.username;
    artist.Art = [art.Title];
    artist.save();
  } else {
    artists[0].Art.push(art.Title);
    artists[0].save();
  }

  userData.Artists = true;
  userData.save();
  console.log(userData);

  res.status(200).send("Art posted!");
});

app.post("/login", async (req, res) => {
  let user = new User();
  user.username = req.body.username;
  user.password = req.body.password;

try {
    let resultUser = await User.find({ username: user.username })

    if (resultUser.length == 0) {
        res.status(400).send("Username does not exist");
        return;
    }

    let attemptedUser = resultUser[0];

    console.log(attemptedUser);

    if (loggedInUsers.includes(String(attemptedUser._id))) {
        res.status(400).send("User already logged in");
        return;
    }

    if (attemptedUser.password != user.password) {
        res.status(400).send("Incorrect password");
        return;
    }

    // User is logged in
    loggedInUsers.push(String(attemptedUser._id));

    console.log("User logged in: " + attemptedUser._id);
    console.log(`Logged in users:`);
    console.log(loggedInUsers);
    res.status(200).send({
        userID: attemptedUser._id,
        userType: attemptedUser.Artists,
        message: "Successfully logged in!"
    });
} catch (error) {
    res.status(500).send("error");
}
});

app.get("/isUserLoggedIn/:id", (req, res) => {
  if (loggedInUsers.includes(req.params.id)) {
    res.status(200).send("true");
  } else {
    res.status(404).send("false");
  }
});

app.post("/register", async (req, res) => {
  let user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  user.Artists = false;
  console.log(user);

  // check if username is already taken
  let proposedUserData = await User.find({ username: user.username });
  if (proposedUserData.length > 0) {
    res.status(400).send("Username already taken");
    return;
  }

  // Only save the user if the username is not taken
    user
      .save()
      .then((result) => {
        loggedInUsers.push(String(result._id));
        res.status(201).send({
          message: "User created!",
          userID: result._id
        });
      })
      .catch((error) => {
        res.status(500).send("error");
      });
});

app.put("/likeArt", (req, res) => {
  // increment number of likes by 1
  Art.findByIdAndUpdate(req.body.id, { $inc: { Likes: 1 } })
    .then((result) => {
      res.status(200).send("success");
    })
    .catch((error) => {
      res.status(500).send("error");
    });
});

app.post ("/postWorkshop/:id", async (req, res) => {
    let userID = req.params.id;

    if (userID == null) {
        res.status(400).send("No UserID provided");
        return;
    }

    if (!loggedInUsers.includes(userID)) {
        res.status(400).send("User is not logged in");
        return;
    }

    let userData = await User.findById(userID);
    if (userData == null) {
        res.status(404).send("User not found");
        return;
    }

    let artists = await Artists.find({ Artist: userData.username });
    console.log("title")
    console.log(req.body.title);

    artists[0].Workshops.push(req.body.title);
    artists[0].save();

    res.status(200).send("Workshop posted!");
});

app.post("/uploadArt/:id", async (req, res) => {
  let userID = req.params.id;

  if (userID == null) {
    res.status(400).send("No UserID provided");
    return;
  }

  if (!loggedInUsers.includes(userID)) {
    res.status(400).send("User is not logged in");
    return;
  }

  let userData = await User.findById(userID);
  if (userData == null) {
    res.status(404).send("User not found");
    return;
  }

  let art = new Art();
  art.Title = req.body.title;
  art.Year = req.body.year;
  art.Category = req.body.category;
  art.Medium = req.body.medium;
  art.Description = req.body.description;
  art.Poster = req.body.poster;
  art.Artist = userData.username;
  art.Likes = 0;
  art.Reviews = [];

  art.save()

  let artists = await Artists.find({ Artist: userData.username });
  console.log("ARTIST:");
  console.log(artists);

  if (artists.length == 0) {
    artist = new Artists();
    artist.Artist = userData.username;
    artist.Art = [art.Title];
    artist.save();
  } else {
    artists[0].Art.push(art.Title);
    artists[0].save();
  }

  res.status(200).send("Art posted!");
});

mongoose.connect("mongodb://127.0.0.1/termproject");

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
  app.listen(3000);
  console.log("Server listening on port 3000");
});
