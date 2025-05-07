export default (rssText) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssText, 'application/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('invalidRss');
  }

  const feed = {
    title: doc.querySelector('channel > title')?.textContent || '',
    description: doc.querySelector('channel > description')?.textContent || '',
  };

  const items = [...doc.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title')?.textContent || '',
    link: item.querySelector('link')?.textContent || '',
    description: item.querySelector('description')?.textContent || '',
  }));

  return { feed, posts: items };
};
