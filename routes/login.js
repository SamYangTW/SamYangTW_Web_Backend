const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
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

router.post("/", function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE"); // If needed
	res.setHeader("Access-Control-Allow-Credentials", true); // If needed
	const account = req.body.account;
	const password = req.body.password;

	const reponse = { status: "", errorMes: "", userId: "", token: "" };
	const sqlMes = `SELECT * FROM User WHERE user_acc = '${account}'`;

	const payload = {
		account: account,
		password: password,
	};
	// 取得 API Token
	const token = jwt.sign(payload, "samyang_tw_secret", { expiresIn: "1d" });

	pool.getConnection((err, connection) => {
		if (err) {
			reponse.status = "fail";
			reponse.errorMes = err;
		} else {
			connection.query(sqlMes, (err, rows) => {
				connection.release(); // return the connection to pool
				if (err) {
					console.error("SQL error: ", err);
					reponse.status = "fail";
					reponse.errorMes = err;
					res.send(JSON.stringify(reponse));
				} else if (rows.length === 0) {
					reponse.status = "fail";
					reponse.errorMes = "您輸入的帳號有誤！";
					res.send(JSON.stringify(reponse));
				} else {
					const dbHashPassword = rows[0].user_pw; // 資料庫加密後的密碼
					const userPassword = password; // 使用者登入輸入的密碼
					bcrypt.compare(userPassword, dbHashPassword).then((result) => {
						// 使用bcrypt做解密驗證
						if (result) {
							reponse.status = "success";
							reponse.userId = rows[0].user_id;
							reponse.token = token;
							res.send(JSON.stringify(reponse));
						} else {
							reponse.status = "fail";
							reponse.errorMes = "您輸入的密碼有誤！";
							res.send(JSON.stringify(reponse));
						}
					});
				}
			});
		}
	});
});

module.exports = router;
