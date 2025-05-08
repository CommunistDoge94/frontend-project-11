import i18n from './i18n.js';

export default (state) => {
  const input = document.getElementById('rss-url');
  const feedback = document.getElementById('rss-feedback');
  const form = document.getElementById('rss-form');

  return {
    highlightError(messageKey) {
      input.classList.add('is-invalid');
      feedback.textContent = i18n.t(`form.errors.${messageKey}`);
      feedback.style.display = 'block';
    },
    clearError() {
      input.classList.remove('is-invalid');
      feedback.textContent = '';
      feedback.style.display = 'none';
    },
    resetForm() {
      form.reset();
      input.focus();
    },
    renderFeeds() {
      const feedsContainer = document.getElementById('feeds');
      feedsContainer.innerHTML = '';
      const feedList = document.createElement('ul');
    
      state.feeds.forEach(({ title, description }) => {
        const li = document.createElement('li');
        li.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        feedList.appendChild(li);
      });
    
      feedsContainer.appendChild(feedList);
    },
    
    renderPosts() {
      const postsContainer = document.getElementById('posts');
      postsContainer.innerHTML = '';
      const ul = document.createElement('ul');
    
      state.posts.forEach(({ title, link }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', link);
        a.setAttribute('target', '_blank');
        a.textContent = title;
        li.appendChild(a);
        ul.appendChild(li);
      });
    
      postsContainer.appendChild(ul);
    },
  };
};
