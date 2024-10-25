import express from 'express'
import puppeteer from 'puppeteer'

// const ENV = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 8000

const app = express()

async function scrapeStories(pageNumber = 1) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
})
  const page = await browser.newPage()
  const url = `https://science.nasa.gov/climate-change/stories/?pageno=${pageNumber}&content_list=true`

  const content = await page.content()
  console.log('content>>>', content)

  await page.goto(url, { waitUntil: 'networkidle2' })

  const stories = await page.evaluate(() => {
    const storyElements = document.querySelectorAll(
      '.hds-content-items-list > div'
    )
    return Array.from(storyElements).map((story) => ({
      image: {
        src: story.querySelector('img')?.src || '',
        alt: story.querySelector('a')?.getAttribute('title') || '',
      },
      link: story.querySelector('a')?.href || '',
      publishdate: story.querySelector('.margin-left-2')?.textContent.trim() || '',
      readtime:
        story.querySelector('.hds-content-item-readtime')?.textContent.trim() ||
        '',
      synopsis: story.querySelector('p')?.textContent.trim() || '',
      title: story.querySelector('a')?.getAttribute('title') || '',
    }))
  })

  await browser.close()
  return stories
}

app.get('/', (req, res) => {
  res.json('Welcome to my Climate Change News API')
})

app.get('/api/climate-stories', async (req, res) => {
  const { page } = req.query
  const pageNumber = parseInt(page, 10) || 1
  const pageSize = 10 // Assuming each page has 10 stories

  const startTime = Date.now() // Track start time for scrapeDuration calculation

  let response = {
    data: [],
    page: pageNumber,
    pageSize: pageSize,
    nextPage: null,
    prevPage:
      pageNumber > 1
        ? `http://localhost:${PORT}/api/climate-stories?page=${pageNumber - 1}`
        : null,
    timestamp: new Date().toISOString(),
    scrapeDuration: null,
    error: null,
  }

  try {
    const stories = await scrapeStories(pageNumber)
    // Set isFinished to true if no stories are found (indicating end of pages)
    response.data = stories
    response.nextPage =
      stories.length > 0
        ? `http://localhost:${PORT}/api/climate-stories?page=${pageNumber + 1}`
        : null

  } catch (error) {
    response.error = 'Failed to scrape stories'
    return res.status(500).json(response)
  } finally {
    const endTime = Date.now()
    response.scrapeDuration = `${endTime - startTime}ms` // Calculate and set scrapeDuration
  }

  res.status(200).json(response)
})

app.get('/ping', (req, res) => {
  res.json('Health check concluded')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})