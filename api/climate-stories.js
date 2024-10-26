import { launch } from 'puppeteer-core';
import {
  args as _args,
  executablePath as _executablePath,
  headless as _headless
} from 'chrome-aws-lambda'; // For Vercel compatibility

export default async (req, res) => {
  const { page } = req.query;
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = 10;

  const startTime = Date.now();
  let response = {
    data: [],
    page: pageNumber,
    pageSize: pageSize,
    nextPage: null,
    prevPage:
      pageNumber > 1 ? `/api/climate-stories?page=${pageNumber - 1}` : null,
    timestamp: new Date().toISOString(),
    scrapeDuration: null,
    error: null,
  };

  try {
    const stories = await scrapeStories(pageNumber);

    response.data = stories;
    response.nextPage =
      stories.length > 0 ? `/api/climate-stories?page=${pageNumber + 1}` : null;
  } catch (error) {
    response.error = 'Failed to scrape stories';
    return res.status(500).json(response);
  } finally {
    const endTime = Date.now();
    response.scrapeDuration = `${endTime - startTime}ms`;
  }

  res.status(200).json(response);
};

async function scrapeStories(pageNumber) {
  let browser;
  try {
    browser = await launch({
      args: _args,
      executablePath: await _executablePath,
      headless: _headless,
    });

    const page = await browser.newPage();
    const url = `https://science.nasa.gov/climate-change/stories/?pageno=${pageNumber}&content_list=true`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    const stories = await page.evaluate(() => {
      const storyElements = document.querySelectorAll(
        '.hds-content-items-list > div'
      );
      return Array.from(storyElements).map((story) => ({
        image: {
          src: story.querySelector('img')?.src || '',
          alt: story.querySelector('a')?.getAttribute('title') || '',
        },
        link: story.querySelector('a')?.href || '',
        readtime:
          story
            .querySelector('.hds-content-item-readtime')
            ?.textContent.trim() || '',
        synopsis: story.querySelector('p')?.textContent.trim() || '',
        title: story.querySelector('a')?.getAttribute('title') || '',
        publishdate:
          story.querySelector('.margin-left-2')?.textContent.trim() || '',
      }));
    });

    return stories;
  } finally {
    if (browser) await browser.close()
  }
}
