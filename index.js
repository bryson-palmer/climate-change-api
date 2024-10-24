import axios from 'axios'
import express from 'express'
import * as cheerio from 'cheerio'

const PORT = process.env.PORT || 8000

const app = express()

const newspapers = [
  {
    name: 'thetimes',
    base: 'https://www.thetimes.com',
    address: 'https://www.thetimes.com/uk/environment/climate-change',
    isAriaLabel: false,
    selector: 'a:contains("climate")',
  },
  {
    name: 'guardian',
    base: 'https://www.theguardian.com',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    isAriaLabel: true,
    selector: 'a[aria-label*="climate"]',
  },
  {
    name: 'telegraph',
    base: 'https://www.telegraph.co.uk',
    address: 'https://www.telegraph.co.uk/climate-change/',
    isAriaLabel: false,
    selector: 'a:contains("climate")',
  }
]

const getArticles = async (newspaperId = null) => {
  const filteredNewspapers = newspaperId
    ? newspapers.filter((newspaper) => newspaper.name === newspaperId)
    : newspapers

  const articlePromises = filteredNewspapers.map(async (curr) => {
    const { address, base, isAriaLabel, name, selector } = curr

    // Fetch the articles
    try {
      const response = await axios.get(address)
      const html = response.data
      const $ = cheerio.load(html)

      const extractedArticles = $.extract({
        links: [
          {
            selector: selector,
            value: (el) => {
              const title = isAriaLabel
                ? $(el).attr("aria-label")
                : $(el).text().trim()
              const url = $(el).attr("href")
              return {
                title,
                url: `${base}${url}`,
                source: name,
              }
            },
          },
        ],
      })

      return extractedArticles.links
    } catch (error) {
      console.log("ERROR:", error.message)
      return []
    }
  })

  const articleArrays = await Promise.all(articlePromises)
  const data = articleArrays.flat()

  return data
}

app.get('/', (req, res) => {
  res.json('Welcome to my Climate Change News API')
})

app.get('/news', async (req, res) => {
  const articles = await getArticles()
  articles.length
    ? res.json(articles)
    : res.json('There were no climate change articles from any of the publications today.')
})

app.get('/news/:newspaperId', async (req, res) => {
  const newspaperId = req.params.newspaperId

  // Use the modified getArticles function to get articles for the specific newspaper
  const articles = await getArticles(newspaperId)

  articles.length
    ? res.json(articles)
    : res.json(`There were no climate change articles from ${newspaperId} today.`)
})

app.get('/ping', (req, res) => {
  res.json('Health check concluded')
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))