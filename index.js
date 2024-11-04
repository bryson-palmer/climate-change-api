import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import climateStories from './api/climate-stories.js'
import vitalSigns from './api/vital-signs.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Serve static files if applicable
app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000

  app.get('/api/climate-stories', climateStories)
  app.get('/api/vital-signs', vitalSigns)

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

export default app