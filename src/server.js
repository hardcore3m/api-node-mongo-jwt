const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');
const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};
require('dotenv').config()


var bcrypt = require("bcryptjs");

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}));

app.use(
    cookieSession({
        name: "oxlabs-session",
        secret: "COOKIE_SECRET", // should use as secret environment variable
        httpOnly: true
    })
);

const db = require("./models");
const dbconfig = require("./config/dbconfig");
const Role = db.role;
db.mongoose
    .connect(`${dbconfig}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// Seed Roles if database is empty
function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });
            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'moderator' to roles collection");
            });
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}

// simple route
app.get("/", (req, res) => {
    res.send(`<h1>Ox Studios</h1>
  <p>desenvolvimento de softwares e aplicações web</p>`);
});
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});