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

process.on("SIGINT", () => {
  console.log("sigint")
  wss.clients.forEach(function each(client) {
    client.close()
  })
  server.close(() => {
    shutDownDb()
  })
})

wss.on("connection", function (socket) {
  const clients = wss.clients.size
  console.log("Clients connected", clients)

  socket.send(`connected to ws server #${clients}`)

  db.run(`INSERT INTO visitors (count, time)  
    VALUES (${clients}, datetime('now'))
  `)

  socket.on("message", function (e) {
    if (e.toString()) {
      socket.send(e.toString())
    }
  })
})

/* start database */
const sqlite = require("sqlite3")
const db = new sqlite.Database(":memory:")

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `)
})

function getCounts() {
  db.each("SELECT * FROM visitors", (error, row) => {
    console.log(row)
  })
}

function shutDownDb() {
  console.log("Shutting down db")
  getCounts()
  db.close()
}
