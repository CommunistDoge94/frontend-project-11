import axios from 'axios';
import parseRss from './parseRss.js';
import { uniqueId } from 'lodash';

const checkForUpdates = (state) => {
  const promises = state.feeds.map((feed) => {
    const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.url)}`;
    
    return axios.get(proxyUrl)
      .then((response) => {
        const { posts } = parseRss(response.data.contents);

        const existingLinks = state.posts.map((post) => post.link);
        const newPosts = posts
          .filter((post) => !existingLinks.includes(post.link))
          .map((post) => ({
            id: uniqueId(),
            feedId: feed.id,
            ...post,
          }));

        if (newPosts.length > 0) {
          state.posts.push(...newPosts);
        }
      })
      .catch(() => {
      });
  });

  return Promise.all(promises).finally(() => {
    setTimeout(() => checkForUpdates(state), 5000);
  });
};

export default checkForUpdates;
