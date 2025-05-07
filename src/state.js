export default {
  form: {
    state: 'idle', // idle, sending, failed, finished
    error: null,
  },
  feeds: new Set(),
};
