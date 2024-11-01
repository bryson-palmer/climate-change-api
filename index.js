import express from 'express'
import * as api from './api/index.js'

const app = express()

app.get('/', () => "Welcome to the NASA climate change api. Scraped with care by me, for you.")
app.get('/api/climate-stories', api.climateStories)
app.get('/api/vital-signs', api.vitalSigns)

// Start the server locally (for development)
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

export default app