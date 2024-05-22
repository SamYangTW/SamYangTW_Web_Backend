const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

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

	pool.getConnection((err, connection) => {
		if (err) {
			res.send(err);
		} else {
			connection.query("SELECT * from Item", (err, rows) => {
				connection.release(); // return the connection to pool

				if (!err) {
					res.send(rows);
				} else {
					res.send(err);
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
