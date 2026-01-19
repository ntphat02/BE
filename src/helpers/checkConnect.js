const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const { set } = require("../app");

const _TIME = 5000;
const countConnections = () => {
  const numConnections = mongoose.connections.length;
  console.log("Number of active MongoDB connections:", numConnections);
};

//check over load

const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numberCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss / (1024 * 1024); // in MB
    const maxMemory = numberCores * 5;

    console.log(`active connections: ${numConnections}`);
    console.log("Memory usage (MB):", memoryUsage.toFixed(2));

    if (numConnections > numberCores) {
      console.warn("Server is overloaded!");
    }
  }, _TIME);
};
module.exports = { countConnections, checkOverload };
