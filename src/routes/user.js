const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { UserModel } = require("../models/user");
const { set } = require("mongoose");
const userConnections = express.Router();

const SAFE_USER_DATA = "firstName lastName age gender photoUrl skills";

userConnections.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    console.log(loggedInUser);

    const pendingConnections = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DATA); //from userModel

    res.json({
      message: "All connections fetched successfully",
      data: pendingConnections,
    });
  } catch (error) {
    res.sendStatus(400).json({ message: error.message });
  }
});

userConnections.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allConnections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    // to filter the all connections
    const data = allConnections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    res.json({ data });
  } catch (error) {
    res.sendStatus(400).json({ message: error.message });
  }
});

userConnections.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // find all the connection requests
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set(); // lets avoid duplicate user id

    // add user id to the array
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId);
      hideUsersFromFeed.add(req.toUserId);
    });

    const users = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, // avoid all the connections
        { _id: { $ne: loggedInUser._id } }, // avoid yourself
      ],
    }).select(SAFE_USER_DATA);

    res.send({ data: users });
  } catch (error) {
    res.sendStatus(400).json({ message: error.message });
  }
});

module.exports = { userConnections };
