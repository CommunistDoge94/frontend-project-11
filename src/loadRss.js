import axios from 'axios'

import parseRss from './parseRss.js'

const loadRss = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

  return axios.get(proxyUrl)
    .then((response) => {
      const rssContent = response.data.contents
      return parseRss(rssContent)
    })
}

export default loadRss
