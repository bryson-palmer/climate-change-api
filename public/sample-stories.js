import {
  getCurrentPageFromDB,
  getStoriesFromDB,
  saveCurrentPageToDB,
  saveStoriesToDB
} from './db.js'

document.addEventListener('DOMContentLoaded', async () => {
  const sampleEl = document.getElementById('sample')
  const sampleStories = document.getElementById('sample-stories')
  const pagination = document.createElement('div')
  const pageNumber = document.createElement('p')
  const storyButtons = document.createElement('div')
  const backButton = document.createElement('button')
  const forwardButton = document.createElement('button')

  async function getClimateStories(page) {
    const url = `http://localhost:3000/api/climate-stories/${page}`
    // Cache current page number
    await saveCurrentPageToDB(page)
  
    try {
      // Check if data exists in cache
      const cachedStories = await getStoriesFromDB(page)
      if (cachedStories) {
        // If so render this data first
        renderStories(cachedStories.stories, cachedStories.page, cachedStories.nextPage, cachedStories.prevPage)
      }
  
      // Get new data
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
  
      // Pull out relevant pieces of data
      const { data: stories, nextPage, prevPage, page: currentPage } = await response.json()

      // If nothing in cache or it's stale
      if (!cachedStories || cachedStories.stories[0].title !== stories[0].title) {
        // Format page data
        const storiesWithPage = { page: currentPage, stories, nextPage, prevPage }
          
        // Update cache
        await saveStoriesToDB(storiesWithPage)
        // Render new data
        renderStories(stories, currentPage, nextPage, prevPage)
      }    
    } catch (error) {
      console.error('Error fetching stories:', error.message)
    }
  }

  function renderStories(data, page, nextPage, prevPage) {
    const storiesList = document.createElement('ul')

    // Clear any existing content
    sampleStories.innerHTML = ''

    // Render each story
    data.map(({ image, link, publishdate, readtime, synopsis, title }) => {
      const storyCard = document.createElement('div')
      const storyAnchor = document.createElement('a')
      const storyBody = document.createElement('div')
      const storyHeader = document.createElement('div')
      const storyTitle = document.createElement('h2')
      const storyReadtime = document.createElement('p')
      const storyContent = document.createElement('div')
      const storySynopsis = document.createElement('p')
      const storyFooter = document.createElement('div')
      const storyPublishdate = document.createElement('p')
      const bookmarkIcon = document.createElement('i')

      storyTitle.textContent = title
      storyPublishdate.textContent = publishdate
      storySynopsis.textContent = synopsis
      storyReadtime.textContent = readtime

      storyAnchor.setAttribute('class', 'story-anchor')
      storyAnchor.setAttribute('href', link)
      storyAnchor.setAttribute('rel', 'noreferrer')
      storyAnchor.setAttribute('target', '_blank')
      storyAnchor.setAttribute(
        'style',
        `background-image: linear-gradient(
        to top, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.0) 100%),
        url(${image.src})`
      )

      storyCard.setAttribute('class', 'story-card')
      storiesList.setAttribute('class', 'story-cards')
      storyBody.setAttribute('class', 'story-body')
      storyHeader.setAttribute('class', 'story-header')
      storyContent.setAttribute('class', 'story-content')
      storyFooter.setAttribute('class', 'story-footer')
      bookmarkIcon.setAttribute('class', 'fa fa-bookmark')

      storyHeader.appendChild(storyTitle)
      storyHeader.appendChild(storyReadtime)
      storyAnchor.appendChild(storyHeader)
      storyContent.appendChild(storySynopsis)
      storyBody.appendChild(storyContent)
      storyFooter.appendChild(bookmarkIcon)
      storyFooter.appendChild(storyPublishdate)
      storyBody.appendChild(storyFooter)
      storyCard.appendChild(storyAnchor)
      storyCard.appendChild(storyBody)
      storiesList.appendChild(storyCard)

      return storiesList
    })

    sampleStories.appendChild(storiesList)

    // Pagination
    pageNumber.textContent = page
    pagination.appendChild(pageNumber)

    const backPage = prevPage?.slice(-1)
    const forwardPage = nextPage?.slice(-1)

    backButton.setAttribute('data-page', backPage)
    backButton.setAttribute('class', 'button')
    backButton.textContent = '⬅'

    forwardButton.setAttribute('data-page', forwardPage)
    forwardButton.setAttribute('class', 'button')
    forwardButton.textContent = '⮕'

    storyButtons.setAttribute('class', 'story-buttons')
    pagination.setAttribute('class', 'pagination glass')
    storyButtons.appendChild(backButton)
    storyButtons.appendChild(forwardButton)
    pagination.appendChild(storyButtons)
    sampleStories.appendChild(pagination)
  }

  const previousPage = await getCurrentPageFromDB()

  // Call on document loaded
  getClimateStories(previousPage ?? 1)

  // Listen for back button clicks
  backButton.addEventListener('click', () => {
    const previousPageNumber = backButton.dataset.page
    if (!!previousPageNumber) {
      getClimateStories(previousPageNumber)
      window.scrollTo({
        top: sampleEl.offsetTop,
        behavior: 'smooth',
      })
    }
  })

  // Listen for forward button clicks
  forwardButton.addEventListener('click', () => {
    const nextPageNumber = forwardButton.dataset.page
    if (!!nextPageNumber) {
      getClimateStories(nextPageNumber)
      window.scrollTo({
        top: sampleEl.offsetTop,
        behavior: 'smooth',
      })
    }
  })
})
