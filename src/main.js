import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import onChange from 'on-change';
import validate from './validate.js';
import initView from './view.js';
import state from './state.js';
import i18n from './i18n.js';

const watchedState = onChange(state, (path, value) => {
  const view = initView(watchedState);

  if (path === 'form.error') {
    view.highlightError(value);
  }

  if (path === 'form.state' && value === 'finished') {
    view.clearError();
    view.resetForm();
    view.renderFeeds();
  }
});

const form = document.getElementById('rss-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('rss-url');
  const url = input.value.trim();

  watchedState.form.state = 'sending';

  validate(url, watchedState.feeds)
    .then((validUrl) => {
      watchedState.feeds.add(validUrl);
      watchedState.form.state = 'finished';
    })
    .catch((err) => {
      watchedState.form.state = 'failed';
      if (err.message.includes('URL')) {
        watchedState.form.error = 'url';
      } else if (err.message.includes('существует')) {
        watchedState.form.error = 'duplicate';
      } else {
        watchedState.form.error = 'unknown';
      }
    });
});

document.querySelectorAll('[data-i18n]').forEach((el) => {
  const key = el.getAttribute('data-i18n');
  el.textContent = i18n.t(key);
});
