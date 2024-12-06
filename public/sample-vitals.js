document.addEventListener('DOMContentLoaded', async () => {
  
  const sampleVitals = document.getElementById('sample-vitals')
  const vitalsList = document.createElement('ul')
  const cardSkeleton = document.querySelector('.card-skeleton')
  const skeletonImage = document.querySelector('.skeleton-image')
  
  try {
    const isProduction = window.origin.startsWith('https://climate-data.vercel.app')
    const baseUrl = isProduction ? 'https://climate-data.vercel.app' : 'http://localhost:3000'
    const url = `${baseUrl}/api/vital-signs`
    
    cardSkeleton.setAttribute('style', 'height: 100px')
    skeletonImage.setAttribute('style', 'height: 3px')

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error( `Response status: ${response.status}`)
    }

    const { data } = await response.json()

    data.map(({
      link,
      title,
      units,
      valueChange,
      valueDirection,
    }) => {
      const vitalCard = document.createElement('a')
      const vitalTitle = document.createElement('h2')
      const subtitle = document.createElement('div')
      const vitalSign = document.createElement('p')
      const vitalDirection = document.createElement('span')

      vitalTitle.textContent = title
      vitalSign.textContent = ` ${valueChange} ${units}`

      subtitle.setAttribute('class', 'subtitle')
      valueDirection === 'up'
        ? vitalDirection.setAttribute('class', 'fa fa-long-arrow-up arrow')
        : vitalDirection.setAttribute('class', 'fa fa-long-arrow-down arrow')
      vitalCard.setAttribute('href', link)
      vitalCard.setAttribute('rel', 'noreferrer')
      vitalCard.setAttribute('target', '_blank')
      vitalCard.setAttribute('class', 'card')
      vitalsList.setAttribute('class', 'cards')
      
      subtitle.appendChild(vitalDirection)
      subtitle.appendChild(vitalSign)
      vitalCard.appendChild(vitalTitle)
      vitalCard.appendChild(subtitle)
      vitalsList.appendChild(vitalCard)

      return vitalsList
    })
  } catch (error) {
    console.error(error.message)
  }
  cardSkeleton.setAttribute('style', 'height: 0px')
  skeletonImage.setAttribute('style', 'height: 0px')
  sampleVitals.appendChild(vitalsList)
})