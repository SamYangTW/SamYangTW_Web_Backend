const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
// app.use(bodyParser.json());

var router = express.Router();

// MySQL
const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "React_Datebase",
	port: 8080,
});

router.use(cors({ origin: "*" }));

/* GET home page. */
router.get("/", function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");

	var authorization = req.headers.authorization;
	var token = authorization.split(" ")[1];

	const response = { status: "", errMes: "", data: [] };

	jwt.verify(token, "samyang_tw_secret", (err, payload) => {
		if (err) {
			response.status = "fail";
			response.errMes = err.message;
			res.send(JSON.stringify(response));
		} else {
			pool.getConnection((err, connection) => {
				if (err) {
					response.status = "fail";
					response.errMes = err;
					res.send(JSON.stringify(response));
				} else {
					connection.query("SELECT * from Item", (err, rows) => {
						connection.release(); // return the connection to pool

						if (!err) {
							response.status = "success";
							response.data = rows;
							res.send(JSON.stringify(response));
						} else {
							response.status = "fail";
							response.errMes = err;
							res.send(JSON.stringify(response));
						}
					});
				}
			});
		}
	});
});

router.post("/", function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE"); // If needed
	res.setHeader("Access-Control-Allow-Credentials", true); // If needed
	var custom = req.body;

	const reponse = { status: "", errorMes: "" };

	pool.getConnection((err, connection) => {
		if (err) {
			reponse.status = "fail";
			reponse.errorMes = err;
			res.send(JSON.stringify(reponse));
		} else {
			connection.query(`INSERT INTO Item SET ?`, custom, (err, rows) => {
				connection.release(); // return the connection to pool

				if (!err) {
					reponse.status = "success";
					res.send(JSON.stringify(reponse));
				} else {
					reponse.status = "fail";
					reponse.errorMes = err;
					res.send(JSON.stringify(reponse));
				}
			});
		}
	});
});

module.exports = router;
