const dotenv = require('dotenv');

// Also can configure for different environments.
dotenv.config();

const app_routes = require('./src/routes/app_routes')

var server = app_routes.app.listen(process.env.PORT, function () {
   console.log("App listening at http://%s:%s", server.address().address, server.address().port)
})

process.on('uncaughtException', err => {
   console.log(`Uncaught Exception: ${err.message}`)
 })