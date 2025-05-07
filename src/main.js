import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const form = document.getElementById('rss-form');
const feedsContainer = document.getElementById('feeds');
const feeds = new Set();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = document.getElementById('rss-url').value.trim();
  
  if (!url) return;
  
  if (feeds.has(url)) {
    alert('Данная ссылка уже добавлена.');
    return;
  }

  feeds.add(url);
  renderFeeds();
  form.reset();
});

function renderFeeds() {
  feedsContainer.innerHTML = '';
  feeds.forEach(url => {
    const div = document.createElement('div');
    div.textContent = url;
    feedsContainer.appendChild(div);
  });
}