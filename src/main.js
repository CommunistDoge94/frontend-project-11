import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import onChange from 'on-change'
import { uniqueId } from 'lodash'
import * as yup from 'yup'
import axios from 'axios'
import { Modal } from 'bootstrap'

import initView from './view.js'
import { i18n, initI18n } from './i18n.js'
import { loadRss, parseRss } from './loadRss.js'

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

  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('preview-button')) return

    const { postId } = e.target.dataset
    const post = watchedState.posts.find(p => p.id === postId)
    if (!post) return

    if (!watchedState.readPostIds.includes(postId)) {
      watchedState.readPostIds.push(postId)
      view.updatePostLink(post.link)
    }

    const modalElement = document.getElementById('previewModal')
    const modal = new Modal(modalElement)
    const modalTitle = document.getElementById('previewModalLabel')
    const modalBody = document.querySelector('.modal-body')

    modalTitle.textContent = post.title
    modalBody.textContent = post.description
    modal.show()

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n')
      if (el.tagName === 'INPUT') {
        el.setAttribute('placeholder', i18n.t(key))
      } 
      else {
        el.textContent = i18n.t(key)
      }
    })
  })

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    if (el.tagName === 'INPUT') {
      el.setAttribute('placeholder', i18n.t(key))
    } else {
      el.textContent = i18n.t(key)
    }
  })

  const checkForUpdates = (state) => {
    const promises = state.feeds.map((feed) => {
      const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.url)}`

      return axios.get(proxyUrl)
        .then((response) => {
          const { posts } = parseRss(response.data.contents)

          const existingLinks = state.posts.map(post => post.link)
          const newPosts = posts
            .filter(post => !existingLinks.includes(post.link))
            .map(post => ({
              id: uniqueId(),
              feedId: feed.id,
              ...post,
            }))

          if (newPosts.length > 0) {
            state.posts.push(...newPosts)
          }
        })
        .catch(() => {})
    })

    return Promise.all(promises).finally(() => {
      setTimeout(() => checkForUpdates(state), 5000)
    })
  }

  checkForUpdates(watchedState)
})
