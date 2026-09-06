const dns = require("dns");
const mongoose = require("mongoose");

let connection;

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!connection) {
    const dnsServers = process.env.MONGODB_DNS_SERVERS
      ?.split(",")
      .map((server) => server.trim())
      .filter(Boolean);

    if (dnsServers?.length) {
      dns.setServers(dnsServers);
    }

    connection = mongoose.connect(process.env.MONGODB_URI);
  }

  return connection;
}

module.exports = connectDB;
