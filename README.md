# Climate Data API 🌎

### Unofficial API collection of scraped climate stories and climate vital signs from [NASA](https://science.nasa.gov/climate-change). 🚀 

### App: [climate-data.vercel.app](https://climate-data.vercel.app)

  I built this API collection so that developers could have easy access to NASA climate data for their own projects. It's conveniently set up so a developer can build some climate news cards or a banner of climate vital signs. The [docs](https://climate-data.vercel.app) are located on the home route. I wanted to gain some experience using scraping functionality, vercel serverless functions, and Three.js 3D library. I am a fan of NASA and space exploration. This was a fun way to merge it with my passion for programming. Program responsibly and enjoy!
    
  endpoint: /api/climate-stories/:page
  * Where the dynamic page value is the user request param
  * Returns a list of climate stories with the story object shape of:
  ```
  {
    data: [
      {
        image: {
          src: string climate story image url
          alt: string climate story title
        },
        link: string climate story article url
        readtime: string how many minutes to read article
        synopsis: string first few lines of article truncated
        title: string climate story article title
        publishdate: string how many days/months ago published
      },
    ],
    error: null | error,
    nextPage: null | string url /api/climate-stories/nextPage,
    prevPage: null | string url /api/climate-stories/prevPage,
    page: number,
    pageSize: number,
    timestamp: sting Date.now()
  }
  ```
 
  endpoint: /api/vital-signs
  * Returns a list of climate vital signs with the vital sign object shape of:
  ```
  {
    data: [
      {
        link: string vital sign url,
        title: string vital sign title,
        units: string vital sign unit of measurement phrase,
        valueChange: string vital sign value changed,
        valueDirection: string vital sign value direction up | down,
      },
    ],
    error: null | error,
    timestamp: sting Date.now()
  }
  ```
