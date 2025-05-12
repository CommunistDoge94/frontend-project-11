import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import onChange from 'on-change'
import { uniqueId } from 'lodash'
import * as yup from 'yup'

import initView from './view.js'
import { i18n, initI18n } from './i18n.js'
import loadRss from './loadRss.js'
import checkForUpdates from './updater.js'

initI18n().then(() => {
  yup.setLocale({
    string: {
      url: i18n.t('form.errors.url'),
    },
    mixed: {
      notOneOf: i18n.t('form.errors.duplicate'),
      required: i18n.t('form.errors.required'),
    },
  })

  const validate = (url, existingFeeds) => {
    const schema = yup.string().required().url().notOneOf([...existingFeeds])
    return schema.validate(url)
  }

  const state = {
    form: {
      state: 'idle',
      error: null,
    },
    feeds: [],
    posts: [],
    readPostIds: [],
  }
  
  const watchedState = onChange(state, (path, value) => {
    console.log(`[onChange] ${path} =`, value);
    if (path === 'form.error') {
      view.highlightError(value)
    }

    if (path === 'form.state' && value === 'finished') {
      view.clearError()
      view.showSuccessMessage()
      view.resetForm()
      view.renderFeeds()
      view.renderPosts()
    }

    if (path === 'posts') {
      view.renderPosts()
    }
  })

  const view = initView(watchedState, i18n)

  const form = document.getElementById('rss-form')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = document.getElementById('rss-url')
    const url = input.value.trim()

    watchedState.form.state = 'sending'

    validate(url, watchedState.feeds.map(f => f.url))
      .then(() => loadRss(url))
      .then(({ feed, posts }) => {
        const feedId = uniqueId()
        watchedState.feeds.push({ id: feedId, url, ...feed })

        const preparedPosts = posts.map(post => ({ id: uniqueId(), feedId, ...post }))
        watchedState.posts.push(...preparedPosts)

        watchedState.form.state = 'finished'
      })
      .catch((err) => {
        watchedState.form.state = 'failed'

        if (err.name === 'ValidationError') {
          if (err.message === i18n.t('form.errors.url')) {
            watchedState.form.error = 'url'
          }
          else if (err.message === i18n.t('form.errors.duplicate')) {
            watchedState.form.error = 'duplicate'
          }
        }
        else if (err.message.includes('invalidRss')) {
          watchedState.form.error = 'invalidRss'
        }
        else {
          watchedState.form.error = 'network'
        }
      })
  })

  
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
  console.log(`[i18n] ${key} → ${i18n.t(key)}`)  // 👈 отладка
  if (el.tagName === 'INPUT') {
    el.setAttribute('placeholder', i18n.t(key))
  } else {
    el.textContent = i18n.t(key)
  }
  })

  checkForUpdates(watchedState)
})
