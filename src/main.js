import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import onChange from 'on-change';
import validate from './validate.js';
import initView from './view.js';
import state from './state.js';

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
      watchedState.form.error = err.message;
    });
});
