import * as cheerio from 'cheerio'
import { chromium } from 'playwright'

async function vitalSigns(req, res) {
  try {
    const urlBase = 'https://climate.nasa.gov'
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('https://climate.nasa.gov/module/5/')
    const html = await page.content()
    const $ = cheerio.load(html)

    const vitals = []

    $('a.image_and_description_container').each((_, element) => {
      const link = `${urlBase}${$(element).attr('href')}`
      const title = $(element).find('div.title').text().trim()
      const units = $(element).find('div.units').text().trim()
      const valueChange = $(element).find('div.change_number').text().trim()
      const valueDirection = $(element).find('div[class*=value]').attr('class').split(' ')[1]

      if (link && title && units && valueChange && valueDirection) {
        vitals.push({
          link,
          title,
          units,
          valueChange,
          valueDirection,
        })
      }

      return
    })

    res
      .status(200)  
      .json({
        data: vitals,
        error: null,
        timestamp: new Date().toISOString(),
      })
    await browser.close()
  } catch (error) {
    console.error('Error in scraping function:', error)
    res.status(500).json({ error: 'Failed to scrape vital signs' })
  }
}

export default vitalSigns