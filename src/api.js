const express = require('express')
const router = express.Router()
const fs = require('fs')
const { v4 } = require('uuid')

const DATA_PATH = './data.json'
const ENCODING = 'utf8'

const checkQueryParams = (req, res, next) => {
  const { name, price } = req.query
  if (!name && !price) {
    res.status(400).send({ message: `Name and Price is missing` })
  } else if (!price && req.method === 'POST') {
    res.status(400).send({ message: `Price is missing` })
  } else if (!name && req.method === 'POST') {
    res.status(400).send({ message: `Name is missing` })
  } else {
    next()
  }
}
router
  .get('/property', (req, res) => {
    fs.readFile(DATA_PATH, ENCODING, (err, data) => {
      if (err) {
        return res.status(400).send({ message: 'API error' })
      }
      res.json(JSON.parse(data))
    })
  })
  .post('/property', checkQueryParams, (req, res) => {
    const new_property = {
      id: v4(),
      ...req.query
    }

    const properties = JSON.parse(fs.readFileSync(DATA_PATH, ENCODING))
    properties.push(new_property)
    fs.writeFileSync(DATA_PATH, JSON.stringify(properties))
    res.send(new_property)
  })
  .patch('/property/:id', checkQueryParams, (req, res) => {
    let properties = JSON.parse(fs.readFileSync(DATA_PATH, ENCODING))
    properties = properties.map(property =>
      property.id === req.params.id ? { ...property, ...req.query } : property
    )
    fs.writeFileSync(DATA_PATH, JSON.stringify(properties))
    res.send(`Updated`)
  })
  .delete('/property/:id', (req, res) => {
    const properties = JSON.parse(fs.readFileSync(DATA_PATH, ENCODING))
    fs.writeFileSync(
      DATA_PATH,
      JSON.stringify(
        properties.filter(property => property.id !== req.params.id)
      ),
      res.send(`Updated`)
    )
  })

module.exports = router
