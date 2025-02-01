import HttpError from "../models/http-error.js";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
// const getCoordsForAddress = require('../util/location');
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!place) {
    throw new HttpError("Place not found by place Id", 404);
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => p.creator === userId);
  if (!places || places.length === 0) {
    return next(new Error("Place not found by user Id", 404));
  }
  res.json({ places });
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

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Enter valid input", 422);
  }
  const { title, address, description, coordinates, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    address,
    description,
    location: coordinates,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const PlaceIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  if (!updatePlace) {
    throw new HttpError("Place not found to update", 400);
  }

  const { title, description } = req.body;
  if (title) {
    updatePlace.title = title;
  }
  if (description) {
    updatePlace.description = description;
  }

  DUMMY_PLACES[PlaceIndex] = updatePlace;

  res
    .json({ message: "Updated Successfully", place: updatedPlace })
    .status(200);
};

const deletePlace = (req, res, next) => {
  const placeId = req.body.pid;
  if (DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("place doesn't exist", 401);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted Successfully" });
};

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
