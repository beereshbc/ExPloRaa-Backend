import { v4 as uuidv4 } from "uuid";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";

let USERS = [
  {
    id: "u1",
    name: "Beeresh",
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    places: 3,
    email: "a@a.com",
    password: "123",
  },
  {
    id: "u2",
    name: "Paramathma",
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    places: 2,
    email: "b@b.com",
    password: "123",
  },
];

const getUsers = (req, res, next) => {
  const users = USERS;
  res.json({ users: users });
};

const getUserById = (req, res, next) => {
  const userId = req.params.uid;
  const user = USERS.find((u) => u.id === userId);
  console.log("Hey it Works");
  res.json({ Name: "Hello! Beeresh", user });
};

const signIn = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Enter valid input", 422);
  }

  const { name, placeCount, email, password } = req.body;

  const hasUser = USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Email is already exist", 422);
  }

  const createdUser = {
    id: uuidv4(),
    name: name,
    places: placeCount,
    email,
    password,
  };

  USERS.push(createdUser);
  res.status(200).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Could not found user try again ", 401);
  }
  res.json({ message: "Login Successfully" });
};

const updateUser = (req, res, next) => {
  const userId = req.params.uid;
  const updatedUser = { ...USERS.find((u) => u.id === userId) };
  const userIndex = USERS.findIndex((u) => u.id === userId);

  const { name, placeCount } = req.body;
  updatedUser.name = name;
  updatedUser.places = placeCount;
  USERS[userIndex] = updatedUser;
  res.status(200).json({ message: "Successfully Updated" });
};

const deleteUser = (req, res, next) => {
  const userId = req.params.uid;
  USERS = USERS.filter((u) => u.id !== userId);
  res.status(200).json({ message: "Deleted successfully" });
};

export { getUserById, signIn, updateUser, deleteUser, login, getUsers };
