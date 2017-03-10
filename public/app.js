const Server = require('./server.js')
const port = (process.env.PORT || 1010)
const app = Server.app()
app.listen(port)
