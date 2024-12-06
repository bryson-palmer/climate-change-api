const db = new Dexie('ClimateStoriesDB')

db.version(1).stores({
  pages: 'page', // 'page' is the primary key
  currentPage: 'value'
})

// Utility functions
const getStoriesFromDB = async (page) => {
  const pageNumber = Number(page)
  try {
    const pageData = await db.pages.get(pageNumber)
    return pageData ?? null
  } catch (err) {
    console.error('Error fetching stories from IndexedDB:', err)
      return null
  }
}

const saveStoriesToDB = async ({ page, stories, nextPage, prevPage }) => {
  try {
    await db.pages.put({
      page,
      stories,
      nextPage,
      prevPage
    })
  } catch (err) {
      console.error('Error saving stories to IndexedDB:', err)
  }
}

const getCurrentPageFromDB = async () => {
  try {
    const currentPage = await db.currentPage.orderBy('value').last()
    const timeLapsed = Date.now() - currentPage?.ts
    const oneDay = 12 * 60 * 60 * 1000

    // Cache is stale after 12 hours
    if (timeLapsed > oneDay) {
      db.currentPage.clear()
      db.pages.clear()
      return null
    }
    return currentPage?.value
  } catch (err) {
    console.error('Error fetching current page from IndexedDB:', err)
      return null
  }
}

const saveCurrentPageToDB = async (value) => {
  const pageNum = Number(value)

  try {
    await db.currentPage.clear()
    await db.currentPage.add({ value: pageNum, ts: Date.now() })
  } catch (err) {
      console.error('Error saving current page to IndexedDB:', err)
  }
}

export { getCurrentPageFromDB, getStoriesFromDB, saveCurrentPageToDB,saveStoriesToDB }
