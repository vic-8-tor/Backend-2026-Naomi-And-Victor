const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let bucket = null;

mongoose.connection.once("open", () => {
  bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "dps",
  });
  console.log("GridFS Initialized");
});

const getBucket = () => bucket;

module.exports = { getBucket };