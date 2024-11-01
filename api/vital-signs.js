// import axios from 'axios'
import * as cheerio from 'cheerio'
import { chromium } from 'playwright'

export async function vitalSigns(req, res) {
  try {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('https://climate.nasa.gov/module/5/')
    const html = await page.content()
    // const { data } = await axios.get('https://climate.nasa.gov/module/5/')
    const $ = cheerio.load(html) // took out data

    const vitals = []

    $('a.image_and_description_container').each((_, element) => {
      const changeNumber = $(element).find('div.change_number').text().trim()
      const direction = $(element).find('div[class*=value]').attr('class').split(' ')[1]
      const link = $(element).attr('href')
      const title = $(element).find('div.title').text().trim()
      const units = $(element).find('div.units').text().trim()

      if (changeNumber && direction && link && title && units) {
        vitals.push({
          changeNumber,
          direction,
          link,
          title,
          units
        })
      }

      return
    })

    // Return the result wrapped in an object
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