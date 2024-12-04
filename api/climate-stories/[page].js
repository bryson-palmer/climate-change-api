import axios from 'axios'
import * as cheerio from 'cheerio'

export default async (req, res) => {
  /*
    Using both req types in order to handle the page parameter both locally and in Vercel's environment.
    Formatting the req string by parsing it into an integer and also converting to absolute value.
  */
  const pageNumber = Math.abs(parseInt(req.query.page ?? req.params.page, 10) || 1)

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
      const readtime = $(element).find('.hds-content-item-readtime').text().trim()
      const synopsis = $(element).find('p').text().trim()
      const title = $(element).find('a').attr('title')

      let link = $(element).find('a').attr('href')
      if (link.charAt(0) === '/') {
        link = `https://science.nasa.gov${link}`
      }

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

    const next =
      stories.length > 0 && stories.length === 10
        ? `/api/climate-stories/${pageNumber + 1}`
        : null

    const previous =
      stories.length > 0 && pageNumber > 1
        ? `/api/climate-stories/${pageNumber - 1}`
        : null

    res
      .status(200)  
      .json({
        data: stories.length ? stories : 'End of climate stories',
        error: null,
        nextPage: next,
        prevPage: previous,
        page: pageNumber,
        pageSize: stories.length,
        timestamp: new Date().toISOString(),
      })
  } catch (error) {
    console.error('Error in scraping function:', error)
    res.status(500).json({ error: 'Failed to scrape stories' })
  }
}