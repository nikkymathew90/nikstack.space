const express = require("express")
const app = express()
const server = require("http").createServer()

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname })
})

server.on("request", app)
server.listen(3000, function () {
  console.log("server started on post 3000")
})

/* start websocket */

const webSocketServer = require("ws").Server
const wss = new webSocketServer({ server: server })

wss.on("connection", function (socket) {
  const clients = wss.clients.size

  socket.send(`connected to ws server #${clients}`)

  socket.on("message", function (e) {
    if (e.toString()) {
      socket.send(e.toString())
    }
  })
})
