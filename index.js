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

const articles = []

newspapers.forEach(({
  address,
  base,
  isAriaLabel,
  name,
  selector,
}) => {
  axios
    .get(address)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)

      $.extract({
        links: [
          {
            selector: selector,
            value: (el) => {
              const title = isAriaLabel
                ? $(el).attr("aria-label")
                : $(el).text().trim()
              const url = $(el).attr('href')
              articles.push({
                title,
                url: `${base}${url}`,
                source: name
              })
            },
          },
        ],
      })
    })
    .catch(error => {
      console.log("ERROR:", error.message)
    })
})

app.get('/', (req, res) => {
  res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {
  articles.length
    ? res.json(articles)
    : res.json('There were no climate change articles from any of the publications today.')
})

app.get('/news/:newspaperId', (req, res) => {
  const newspaperId = req.params.newspaperId

  const {
    address,
    base,
    isAriaLabel,
    name,
    selector
  } = newspapers.filter(newspaper => newspaper.name === newspaperId)[0]
  
  axios.get(address)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)

      const theseArticles = []

      $.extract({
        links: [
          {
            selector,
            value: (el) => {
              const title = isAriaLabel
                ? $(el).attr("aria-label")
                : $(el).text().trim()
              const url = $(el).attr('href')
              theseArticles.push({
                title,
                url: `${base}${url}`,
                source: name
              })
            },
          },
        ],
      })
      theseArticles.length
        ? res.json(theseArticles)
        : res.json(`There were no climate change articles from the ${name} today.`)
    })
    .catch(error => {
      console.log("ERROR:", error.message)
    })
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))