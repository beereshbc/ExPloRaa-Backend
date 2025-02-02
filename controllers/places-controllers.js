import HttpError from "../models/http-error.js";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import { Place } from "../models/place.js";
import mongoose from "mongoose";

// const getCoordsForAddress = require('../util/location');  <--- For google map
let DUMMY_PLACES = [
  {
    id: "p1",
    creator: "u1",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b2/The_elegant_stone_chariot.jpg",
    title: "ಹಂಪಿ",
    description:
      "Hampi, known as Kishkindha in the Ramayana age is a town in the Vijayanagara district in the Indian state of Karnataka. Located along the Tungabhadra River in the east and center part of the state, Hampi is near the city of Hospet.",
    address: "Hampi ಹಂಪಿ Karnataka 583239 India",
    location: {
      lat: 15.23584,
      lng: 76.620629,
    },
  },
  {
    id: "p2",
    creator: "u2",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Hampi_virupaksha_temple.jpg",
    title: "ಹಂಪಿ",
    description:
      "Hampi, known as Kishkindha in the Ramayana age is a town in the Vijayanagara district in the Indian state of Karnataka. Located along the Tungabhadra River in the east and center part of the state, Hampi is near the city of Hospet.",
    address: "Hampi ಹಂಪಿ Karnataka 583239 India",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
  },
];

//getPlaceById
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError("Something went wrong place not found", 500);
    return next(err);
  }
  if (!place) {
    const error = new HttpError("Place not found by place Id", 404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) }); // ---> kelagiroo output last alli id anth edeyalla edu eline ind bandirod
};

//o/p getPlaceById
//   {
//     "place": {
//         "location": {
//             "lat": 0,
//             "lng": 0
//         },
//         "_id": "679f2b8de37a71a13de5fd9e",
//         "title": "Mysoore",
//         "description": "Muysoore is culterle capital of karnataka",
//         "address": "Davanagere",
//         "creator": "d43686cb-4c67-4ded-9dd8-ce9b73b5a10b",
//         "image": "https://picsum.photos/seed/picsum/200/300",
//         "__v": 0,
//         "id": "679f2b8de37a71a13de5fd9e"
//     }
// }

//getPlaceByUserId
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    const err = new HttpError("Something went Wrong place not found", 500);
    return next(err);
  }

  if (!places || places.length === 0) {
    return next(new HttpError("Place not found by user Id", 404));
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

// Edu location.js ind get api request kalsirode for petch the location

// const createPlace = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError('Invalid inputs passed, please check your data.', 422)
//     );
//   }

//   const { title, description, address, creator } = req.body;

//   let coordinates;
//   try {
//     coordinates = await getCoordsForAddress(address);
//   } catch (error) {
//     return next(error);
//   }

//   // const title = req.body.title;
//   const createdPlace = {
//     id: uuid(),
//     title,
//     description,
//     location: coordinates,
//     address,
//     creator
//   };

//   DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)

//   res.status(201).json({ place: createdPlace });
// };

//Place create
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Enter valid input", 422);
  }
  const { title, address, description, coordinates, creator, image } = req.body;
  const createdPlace = new Place({
    title,
    address,
    description,
    location: coordinates,
    creator: uuidv4(),
    image,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Place creation failed", 500);
    next(error);
  }

  res.status(201).json({ place: createdPlace });
};

//Place Update
const updatePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError("Something went wrong Place con't found", 500);
    return next(err);
  }

  if (!place) {
    throw new HttpError("Place not found to update", 400);
  }

  const { title, description } = req.body;
  place.title = title;
  place.description = description;
  try {
    place.save();
  } catch (error) {
    const err = new HttpError("Update place failed", 500);
    return next(err);
  }
  res.json({ message: "Updated Successfully", place: place }).status(200);
};

//Delete place
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError(
      "Fetching place failed, please try again later.",
      500
    );
    return next(err);
  }
  if (!place) {
    return next(new HttpError("Place not found in the database.", 404));
  }
  try {
    // await place.remove();      <----- edu yaka work aglilla adka mongoDB syntex hakini aste
    await place.deleteOne({ _id: placeId });
  } catch (error) {
    const err = new HttpError(
      "Something went wrong, couldn't delete the place.",
      500
    );
    return next(err);
  }

  res.status(200).json({ message: "Deleted Successfully" });
};

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
