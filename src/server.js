const express = require('express')
const app = express()
const api = require('./api')
const path = require('path')

const PORT = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.use('/api', api)

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
