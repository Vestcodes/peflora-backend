const cron = require("node-cron")
const fetch = require("node-fetch")

// Keep alive job to prevent the server from sleeping
// Every 30 seconds
const job = cron.schedule("*/30 * * * *", () => {
	console.log("Keep alive job running")
	fetch("https://peflora-backend.onrender.com")
		.then((res) => console.log("Keep alive job completed"))
		.catch((err) => console.log("Keep alive job failed", err))
})

job.start();