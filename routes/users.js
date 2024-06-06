const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");

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

router.post("/", function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE"); // If needed
	res.setHeader("Access-Control-Allow-Credentials", true); // If needed
	const body = req.body;
	console.log(body);

	const insertValues = {
		user_id: new Date().getTime(),
		user_name: body.name,
		user_acc: body.account,
		user_pw: bcrypt.hashSync(body.password, 10), // 密碼加密
	};

	const reponse = { status: "", errorMes: "" };

	pool.getConnection((err, connection) => {
		if (err) {
			reponse.status = "fail";
			reponse.errorMes = err;
			res.send(JSON.stringify(reponse));
		} else {
			connection.query(`INSERT INTO User SET ?`, insertValues, (err, rows) => {
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
