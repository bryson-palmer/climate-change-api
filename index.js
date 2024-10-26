import express from 'express'
import climateStories from './api/climate-stories.js'

const app = express()

app.get('/api/climate-stories', climateStories)

// Start the server locally (for development)
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

export default app