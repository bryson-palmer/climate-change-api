import express from 'express'
const path = require('path')

const PORT = process.env.PORT || 8000

const app = express()

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/ping', (req, res) => {
  res.json('Health check concluded')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

module.exports = app