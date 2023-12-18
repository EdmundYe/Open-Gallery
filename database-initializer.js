const mongoose = require("mongoose");
const user = require("./userModel.js");
const artists = require("./artistsModel.js");
const art = require("./artModel.js");

const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");

/**
 * Finds if an artist is in a list of artists
 * @param {string} artist 
 * @param {list} list 
 * @returns {boolean} - true if the artist is in the list, false otherwise
 */
function artistIsInList(artist, list) {
  for (const a of list) {
    if (a.Artist == artist) {
      return true;
    }
  }
  return false;
}

async function run() {
  let artwork = [];

  // read the gallery.json file and parse it into an array of objects
  const artData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "gallery.json"))
  );

  let tempArtistList = [];

  // loop through each art piece
  for (const data of Object.values(artData)) {
    console.log("READING DATA:");
    console.log(data);
    let a = new art();
    a.Title = data.Title;
    a.Artist = data.Artist;
    a.Year = data.Year;
    a.Category = data.Category;
    a.Medium = data.Medium;
    a.Price = data.Price;
    a.Stock = data.Stock;
    a.Description = data.Description;
    a.Poster = data.Poster;
    a.Reviews = [];
    a.Likes = 0;
    artwork.push(a);

    // check if the artist exists in temp list
    console.log("TEMP ARTIST LIST:");
    console.log(tempArtistList);
    console.log(`\tChecking if ${a.Artist} exists in temp list: ${tempArtistList.includes(a.Artist)}`);
    if (!artistIsInList(a.Artist, tempArtistList)) {
      tempArtistList.push({
        Artist: a.Artist,
        Art: [a.Title],
      });
    } else {
      for (const artist of tempArtistList) {
        if (artist.Artist == a.Artist) {
          artist.Art.push(a.Title);
        }
      }
    }
  }

  mongoose.connect("mongodb://127.0.0.1/termproject");
  let db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", async function () {
    await mongoose.connection.dropDatabase();
    console.log("Dropped database. Starting re-creation.");

    let completedArt = 0;
    for (const a of artwork) {
      console.log(`Saving art`);
      console.log(a);
      a.save()
        .then((result) => {
          completedArt++;
          console.log("Art saved.");
          if (completedArt == artwork.length) {
            console.log("All art saved.");
          }
        })
        .catch((err) => {
          throw err;
        });
    }

    // For every artist:
    // 1. Find all art by that artist via find(artist: artist)
    // 2. Add the object ID of each art piece to the artist's art array
    // 3. Save the artist

    console.log("TEMP ARTIST LIST:");
    console.log(tempArtistList);
    
    for (const artist of tempArtistList) {
      let artistArt = await art.find({ artist: artist.Artist });
      console.log("ARTIST");
      console.log(artist);

      console.log("ARTIST ART");
      console.log(artistArt);

      // for each art piece by the artist, add it to the artist's art array
      for (const art of artistArt) {
        artist.art.push(new ObjectId(art._id));
        console.log("Added art to artist.");
        console.log(artist);
      }

      let artistObj = new artists({
        Artist: artist.Artist,
        Art: artist.Art,
      });

      // save the artist
      artistObj.save().then((result) => {
        console.log("Artist saved.");
      }).catch((err) => {
        throw err;
      });
    }
  });
}

async function BuildArtListsFromTitles(artistList) {
  for (const artist of artistList) { // For each artist in the artist list
    newArtIdList = []; // New temp list to represent the artist's art via object IDs
    for (const artPiece of artist.Art) { // For each art piece in the artist's art array
      await art.find({ Title: artPiece }).then((result) => { // Find the art piece in the database
        newArtIdList.push(result._id); // Add the object ID of the art piece to the temp list
      })
    }
    artist.Art = newArtIdList; // Replace the artist's art array with the temp list
  }

  return artistList; // Return the updated artist list
}

run().catch(console.dir);
