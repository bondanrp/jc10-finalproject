let MongoClient = require("mongodb").MongoClient;
let Mongo = require("mongodb");
let { url } = require("../database");

module.exports = {
  getAllUsers: (req, res) => {
    MongoClient.connect(url, (err, client) => {
      let collection = client.db("users").collection("comment");
      collection.find({}).toArray((err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    });
  },
  insertData: (req, res) => {
    let data = {
      comment: "halo",
      test: "bisa ga"
    };
    MongoClient.connect(url, (err, client) => {
      let collection = client.db("users").collection("comment");
      collection.insertOne(data, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    });
  }
};
