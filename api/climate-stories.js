import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function climateStories(req, res) {
  const { page } = req.query
  const pageNumber = parseInt(page, 10) || 1
  const pageSize = 10

  try {
    const { data } = await axios.get(`https://science.nasa.gov/climate-change/stories?pageno=${pageNumber}&content_list=true`)
    const $ = cheerio.load(data)

    const stories = []
    let publishdate

    $('.hds-content-item').each((_, element) => {
      const image = {
        src: $(element).find('img').attr('src'),
        alt: $(element).find('a').attr('title'),
      }
      const link = $(element).find('a').attr('href')
      const readtime = $(element).find('.hds-content-item-readtime').text().trim()
      const synopsis = $(element).find('p').text().trim()
      const title = $(element).find('a').attr('title')
      const published = $(element).find('span').text()

      publishdate = published.split('Article')[1]

      stories.push({
        image,
        link,
        readtime,
        synopsis,
        title,
        publishdate
      })
    })

    // Return the result wrapped in an object
    res
      .status(200)  
      .json({
        data: stories,
        error: null,
        nextPage: stories.length > 0 ? `/api/climate-stories?page=${pageNumber + 1}` : null,
        prevPage: pageNumber > 1 ? `/api/climate-stories?page=${pageNumber - 1}` : null,
        page: pageNumber,
        pageSize: pageSize,
        timestamp: new Date().toISOString(),
      })
  } catch (error) {
    console.error('Error in scraping function:', error)
    res.status(500).json({ error: 'Failed to scrape stories' })
  }
}