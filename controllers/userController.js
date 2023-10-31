const User = require("../models/userModel");

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  user.password = undefined;
  res.status(statusCode).json({ user, token });
};

exports.createUser = (req, res) => {
  const userData = req.body;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "User can not be empty",
    });
  }

  const user = new User(userData);

  user
    .save()
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send(
        {
          message: err.message || "Something went wrong while creating new user.",
        });
    });
};

exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User with id " + req.params.userId + " not found!",
        });
      }
      res.send(user);
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Something went wrong while retrieving user with id " + req.params.userId,
      });
    });
};

exports.findAllUser = (req, res) => {
  const data = req.query;
  User.find(data)
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something went wrong while retrieving users!",
      });
    });
};

exports.updateUser = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "User can not be empty",
    });
  }

  User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User with id " + req.params.userId + " not found!",
        });
      }
      sendTokenResponse(user, 200, res);
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Something went wrong while updating user with id " + req.params.userId,
      });
    });
};

exports.deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User with id " + req.params.userId + " not found!",
        });
      }
      res.send({ message: "User deleted successfully!" });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Something went wrong while deleting user with id " + req.params.userId,
      });
    });
};