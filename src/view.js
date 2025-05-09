import { Modal } from 'bootstrap'

import i18n from './i18n.js'

let modalInstance = null

export default (state) => {
  const input = document.getElementById('rss-url')
  const feedback = document.getElementById('rss-feedback')
  const form = document.getElementById('rss-form')

  if (!modalInstance) {
    const modalElement = document.getElementById('previewModal')
    modalInstance = new Modal(modalElement)
  }

  const modalTitle = document.getElementById('previewModalLabel')
  const modalBody = document.querySelector('.modal-body')

  return {
    highlightError(messageKey) {
      input.classList.add('is-invalid')
      feedback.classList.remove('text-success')
      feedback.classList.add('text-danger')
      feedback.textContent = i18n.t(`form.errors.${messageKey}`)
      feedback.style.display = 'block'
    },
    clearError() {
      input.classList.remove('is-invalid')
      feedback.textContent = ''
      feedback.style.display = 'none'
    },
    showSuccessMessage() {
      feedback.classList.remove('text-danger')
      feedback.classList.add('text-success')
      feedback.textContent = i18n.t('form.success')
      feedback.style.display = 'block'
    },
    resetForm() {
      form.reset()
      input.focus()
    },
    renderFeeds() {
      const feedsContainer = document.getElementById('feeds')
      feedsContainer.innerHTML = ''
      const feedList = document.createElement('ul')

      state.feeds.forEach(({ title, description }) => {
        const li = document.createElement('li')
        li.innerHTML = `<h3>${title}</h3><p>${description}</p>`
        feedList.appendChild(li)
      })

      feedsContainer.appendChild(feedList)
    },

    renderPosts() {
      const postsContainer = document.getElementById('posts')
      postsContainer.innerHTML = ''
      const ul = document.createElement('ul')

      state.posts.forEach((post) => {
        const li = document.createElement('li')
        li.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'mb-2')

        const a = document.createElement('a')
        a.setAttribute('href', post.link)
        a.setAttribute('target', '_blank')
        a.classList.add(state.readPostIds.includes(post.id) ? 'fw-normal' : 'fw-bold')
        a.textContent = post.title

        const button = document.createElement('button')
        button.textContent = i18n.t('buttons.preview')
        button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'ms-2')
        button.setAttribute('type', 'button')
        button.addEventListener('click', () => {
          modalTitle.textContent = post.title
          modalBody.textContent = post.description
          modalInstance.show()

          if (!state.readPostIds.includes(post.id)) {
            state.readPostIds.push(post.id)
          }

          this.renderPosts()
        })

        li.appendChild(a)
        li.appendChild(button)
        ul.appendChild(li)
      })

      postsContainer.appendChild(ul)
    },
  }
}
