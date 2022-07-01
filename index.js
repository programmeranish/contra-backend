const express = require("express");
require("dotenv").config();
const cors = require("cors");

//firebase
const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

const serviceAccount = require("./products-392e2-firebase-adminsdk-48fie-21f9eec1e6.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const app = express();
app.use(express.json());
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    origin: "*",
  })
);

const port = process.env.PORT;

// app.use("/api/products", require("./routes/product.routes.js"));

app.get("/", async (req, res) => {
  db.collection("games")
    .get()
    .then((dataArray) => {
      let datas = [];
      dataArray.forEach((doc) => {
        datas.push(doc.data());
      });
      console.log("datas");
      res.send(datas);
    })
    .catch((err) => {
      res.send("error finding data", err).status(404);
    });
});

app.get("/highscore", async (req, res) => {
  db.collection("highscore")
    .get()
    .then((dataArray) => {
      let datas = [];
      dataArray.forEach((doc) => {
        datas.push(doc.data());
      });
      console.log("datas");
      res.send(datas);
    })
    .catch((err) => {
      res.send("error finding data", err).status(404);
    });
});

app.post("/addscore", (req, res) => {
  const body = req.body;
  db.collection(`games`)
    .doc(body.id)
    .set(body)
    .then(() => {
      res.send("ok");
    })
    .catch((err) => console.log(err));
});
app.post("/addhighscore", (req, res) => {
  const body = req.body;
  db.collection(`highscore`)
    .doc(body.number)
    .set(body)
    .then(() => {
      res.send("ok");
    })
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log("server running");
});
