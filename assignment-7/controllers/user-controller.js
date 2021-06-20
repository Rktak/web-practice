const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const HttpError = require("../utils/http-error");
const Blog= require("../models/blog");

const userSignup = async (req, res, next) => {
  // console.log(req.body);
  const { name, age, email, password } = req.body;
  // Existing user
  let existingUser;
  try {
    existingUser = await User.findOne({
      email: email,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signup failed, please try later", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError("Email already in use", 422);
    return next(error);
  }
  // Encrypt password
  let hashedPasswaord;
  try {
    hashedPasswaord = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Password encryption failed", 500);
    return next(error);
  }
  // User Create
  const createdUser = new User({
    name: name,
    password: hashedPasswaord,
    email: email,
    age: age || 0,
    role: 'User'
  });

  try {
    await createdUser.save();
    
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signup failed", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        age: existingUser.age
      },
      "userSecretKey",
      { expiresIn: "2h" }
    );

    // console.log(token);
  } catch (err) {
    const error = new HttpError("Login Failed, Please try later", 403);
    return next(error);
  }

  return res.json({userId: createdUser.id, email: createdUser.email, token: token});



};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({
      email: email,
    });
    // console.log(existingUser);
  } catch (err) {
    const error = new HttpError("Login failed, Please try later", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid Credentials, Please try later", 403);
    return next(error);
  }



  let isValidPassword = false;
  try {
    //returns true when value matches
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Invalid Credentials, Please try later", 403);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid Credentials, Please try later", 403);
    return next(error);
  }



  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        age: existingUser.age
      },
      "userSecretKey",
      { expiresIn: "2h" }
    );

    // console.log(token);
  } catch (err) {
    const error = new HttpError("Login Failed, Please try later", 403);
    return next(error);
  }

  res.status(200).json({
    email: existingUser.email,
    age: existingUser.age,
    token: token
  });
};

const postBlog = async (req, res, next) => {

  const { email, password, heading, blog } = req.body;

  let existingUser
  try {
    existingUser = await User.findOne({ email: email },);
  }
  catch (err) {
    const error = new HttpError("login failed", 500)
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("User does not exists", 403)
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch {
    const error = new HttpError("login failed", 403);
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError("invalid credentials", 403);
    return next(error);
  }

  const createdBlog = new Blog({
    email: email,
    password: password,
    heading: heading,
    blog: blog,
  });

  try {
    await createdBlog.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Blog posting failed', 500);
    return next(error);
  }

  return res.status(200).json(
    {
      'message': "Blog posted. "
    }
  )
};

const getBlog = async (req, res, next) => {

  const { email, password, heading } = req.body;

  let existingUser

  try {
    existingUser = await User.findOne({ email: email },);
  }
  catch (err) {
    const error = new HttpError("login failed", 500)
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("invalid user credentials", 403)
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch {
    const error = new HttpError("login failed", 403);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("invalid credentials", 403);
    return next(error);
  }

  if (!heading) {
    const error = new HttpError("Heading doesn't exists!!", 403);
    return next(error);
  }
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        firstName: existingUser.firstName,
        email: existingUser.email,
        heading: existingUser.heading
      },
      "userSecretKey",
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("invalid credentials", 500);
    return next(error);
  }
  res.json({
    'first-name': existingUser.firstName,
    'email': existingUser.email,
    'User-id': existingUser.id,
    'heading': existingUser.heading,
    'blog': existingUser.blog

  });
}

exports.userSignup = userSignup;
exports.userLogin = userLogin;
exports.getBlog = getBlog;
exports.postBlog= postBlog;
