export default (state) => {
  const input = document.getElementById('rss-url');
  const feedback = document.getElementById('rss-feedback');
  const form = document.getElementById('rss-form');

  return {
    highlightError(message) {
      input.classList.add('is-invalid');
      feedback.textContent = message;
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
      state.feeds.forEach((url) => {
        const div = document.createElement('div');
        div.textContent = url;
        feedsContainer.appendChild(div);
      });
    },
  };
};
