const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("./models/sequelizeConfig");

db.sequelize.sync({ force: true }).then(() => {console.log("Drop and re-sync db.");});

var corsOptions = {
  origin: "http://localhost:${PORT}"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Lista de Routes
require("./routes/sign-in.routes")(app);



//Healthcheck
app.get("/", (req, res) => {
  res.json({ message: "Home Page" });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

