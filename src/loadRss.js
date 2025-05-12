import axios from 'axios'

const parseRss = (content) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'application/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    throw new Error('invalidRss')
  }

  const feedTitle = doc.querySelector('channel > title')?.textContent
  const feedDescription = doc.querySelector('channel > description')?.textContent

  const items = doc.querySelectorAll('item')
  const posts = Array.from(items).map(item => ({
    title: item.querySelector('title')?.textContent,
    link: item.querySelector('link')?.textContent,
    description: item.querySelector('description')?.textContent,
  }))

  return {
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    posts,
  }
}

const loadRss = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get')
  proxyUrl.searchParams.set('disableCache', 'true')
  proxyUrl.searchParams.set('url', url)

  return axios.get(proxyUrl)
    .then((response) => {
      const rssContent = response.data.contents
      return parseRss(rssContent)
    })
}

export default loadRss
