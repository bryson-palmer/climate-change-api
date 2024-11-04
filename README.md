# climate-change-api

  ### An API collection of serverless functions that scrape climate stories and climate vital signs from NASA
  https://science.nasa.gov/climate-change
    
  endpiont: /api/climate-stories?page={page}
  * where the dynamic page value is the user request query
  * returns a list of climate stories with the story object shape of:
  * `{
  *   data: [
  *     {
  *       image: {
  *         src: string climate story image url
  *         alt: string climate story title
  *       },
  *       link: string climate story article link
  *       readtime: string how many minutes to read article
  *       synopsis: string first few lines of article truncated
  *       title: string climate story article title
  *       publishdate: string how many days/months ago published
  *     },
  *   ],
  *   error: null | error,
  *   nextPage: null | string url /api/climate-stories?page={nextPage},
  *   prevPage: null | string url /api/climate-stories?page={prevPage},
  *   page: number,
  *   pageSize: number,
  *   timestamp: sting Date.now()
  * }`
  * 
  endpiont: /api/vital-signs
  * returns a list of climate vital signs with the vital sign object shape of:
  * `{
  *   data: [
  *     {
  *       link: string vital sign url,
  *       title: string vital sign title,
  *       units: string vital sign unit of measurement phrase,
  *       valueChange: string vital sign value changed,
  *       valueDirection: string vital sign value direction up | down,
  *     },
  *   ],
  *   error: null || error,
  *   timestamp: sting Date.now()
  * }`
