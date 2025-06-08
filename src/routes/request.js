const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { UserModel } = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { run } = require("../utils/sendEmail");

// to make connection request to other user
requestRouter.post(
  "/user/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // get all the data to be saved
      const fromUserId = req.user._id; // this is the loggedIn user, from userAuth middleware
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send({ message: "Invalid status" }); // status should be one of these values
      }

      const toUser = await UserModel.findById(toUserId); // this is the user to whom request is sent
      if (!toUser) {
        return res.status(400).send({ message: "User not found" }); // the user should be present in the database
      }

      const connectionRequestExists = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (connectionRequestExists) {
        return res
          .status(400)
          .send({ message: "Connection Request already exists" }); // connection request should not exist already
      }

      // if (fromUserId.toString() === toUserId) {
      //   return res
      //     .status(400)
      //     .send({ message: "you can not send request to yourself!" }); // fromUserId and toUserId should not be same
      // }

      // create a new connection request
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      const resEmail = await run();
      console.log("resEmail", resEmail);

      // save the connection request

      const fromUser = req.user;

      // console.log("toUser", toUser);
      res.json({
        message: `Connection request sent successfully from ${fromUser.firstName} to ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// to accept or reject the connection request
requestRouter.post(
  "/user/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      // Validate the status
      if (!allowedStatus.includes(status)) {
        return res.status(400).send({ message: "Invalid status" });
      }

      // Find the connection request that is in 'interested' status
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).send({ message: "Invalid or expired request" });
      }

      // Find the user who sent the request (fromUserId)
      const userRequest = await ConnectionRequestModel.findById(requestId);
      const toUser = await UserModel.findById(userRequest.fromUserId);

      if (!toUser) {
        return res.status(400).send({ message: "Sender user not found" });
      }

      // Update the connection request status
      connectionRequest.status = status;
      await connectionRequest.save();

      res.json({
        message: `${loggedInUser.firstName} has ${status} the request from ${toUser.firstName}`,
      });
    } catch (err) {
      console.error("Error processing request:", err);
      res
        .status(500)
        .json({ message: "An error occurred while processing the request" });
    }
  }
);

module.exports = { requestRouter };
