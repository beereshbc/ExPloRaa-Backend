import { v4 as uuidv4 } from "uuid";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import { User } from "../models/user.js";

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

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    const err = new HttpError("User Fetching is failed try again");
    return next(err);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUserById = (req, res, next) => {
  const userId = req.params.uid;
  const user = USERS.find((u) => u.id === userId);
  console.log("Hey it Works");
  res.json({ Name: "Hello! Beeresh", user });
};

const signIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Enter valid input", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Email already register please login", 500);
    return next(err);
  }

  const createdUser = await User({
    name,
    email,
    password,
    places: [],
  });

  try {
    createdUser.save();
  } catch (error) {
    const err = new HttpError("Something went wrong SignIn Failed");
    return next(err);
  }
  res.status(200).json({ user: createdUser });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Login failed try again", 500);
    return next(err);
  }

  if (!identifiedUser || identifiedUser.password !== password) {
    const err = new HttpError("Invalid credentials try again", 401);
    return next(err);
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
