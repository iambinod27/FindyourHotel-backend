const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

// Validation
const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
  fname: Joi.string().min(4).required(),
  lname: Joi.string().min(4).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

// Sign Up USER
router.post("/register", async (req, res) => {
  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist) {
    res.status(400).send({
      "message": "Email already Exists"
    });
    return;
  }

  //   Hashing Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //   On process of adding new user
  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    // validating user inputs
    const { error } = await registerSchema.validateAsync(req.body);

    if (error) {
      res.status(400).send({ "message": error.details[0].message });
      return;
    } else {
      // new User is Added
      const saveUser = await user.save();
      res.status(200).send({ "message": "user created", "user": saveUser });
    }
  } catch (error) {
    res.status(500).send({ message: err.message || "Internal Server Error" });
  }
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

// Login User
router.post("/login", async (req, res) => {
  try {
    // Checking if user email exist
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(200).send({ "message": "Incorrect Email-ID" });

    // Checking if password Matches
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(200).send({ "message": "Incorrect Password" });

    const { error } = await loginSchema.validateAsync(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
      // Sending Token
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.header("auth-token", token).send({ "token": token, "user": user });
    }
  } catch (error) {
    res.status(500).send({ "message": error });
  }
});

module.exports = router;