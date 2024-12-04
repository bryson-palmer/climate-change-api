document.addEventListener('DOMContentLoaded', async () => {
  
  const sampleVitals = document.getElementById('sample-vitals')
  const vitalsList = document.createElement('ul')
  const cardSkeleton = document.querySelector('.card-skeleton')
  const skeletonImage = document.querySelector('.skeleton-image')
  const url = 'https://climate-data.vercel.app/api/vital-signs'
  
  try {
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
      vitalDirection.textContent = valueDirection === 'up' ? '⬆' : '⬇'
      vitalSign.textContent = ` ${valueChange} ${units}`

      subtitle.setAttribute('class', 'subtitle')
      vitalDirection.setAttribute('class', 'arrow')
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