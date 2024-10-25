import express from 'express'
import puppeteer from 'puppeteer'

const PORT = process.env.PORT || 8000

const app = express()

async function scrapeStories(pageNumber = 1) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
})
  const page = await browser.newPage()
  const url = `https://science.nasa.gov/climate-change/stories/?pageno=${pageNumber}&content_list=true`

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
      publishdate:
        story.querySelector('.margin-left-2')?.textContent.trim() || '',
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

  let response = {
    data: [],
    page: pageNumber,
    pageSize: pageSize,
    // nextPage: null,
    // prevPage:
    //   pageNumber > 1
    //     ? `http://localhost:${PORT}/api/climate-stories?page=${pageNumber - 1}`
    //     : null,
    timestamp: new Date().toISOString(),
    error: null,
  }

  try {
    const stories = await scrapeStories(pageNumber)
    console.log('stories>>>', stories)
    response.data = stories
    // response.nextPage =
    //   stories.length > 0
    //     ? `http://localhost:${PORT}/api/climate-stories?page=${pageNumber + 1}`
    //     : null

    return res.status(200).json(response)
  } catch (error) {
    response.error = error
    return res.status(500).json(response)
  }

})

app.get('/test-fetch', async (req, res) => {
  const url = 'https://science.nasa.gov/climate-change/stories/'
  try {
      const response = await fetch(url)
      const body = await response.text()
      res.send(body) // Return the raw HTML for inspection
  } catch (error) {
      res.status(500).send('Failed to fetch')
  }
})

app.get('/ping', (req, res) => {
  res.json('Health check concluded')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})