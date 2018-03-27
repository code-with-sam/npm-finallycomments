// const frame = require('iframe-resizer')

module.exports.generateFromSteemPost = (steemitUrl, options) => {
  if (!options) options = {}
  let settings = {
    message: 'finally-frame-load',
    reputation: options.reputation || true,
    profile: options.profile || true,
    values: options.values || true,
    generated: false
  }
  let iframe = document.createElement('iframe', { scrolling: 'no' })
  iframe.src = steemitUrl
  iframe.width = '100%'
  iframe.style = 'border: none;'
  iframe.classList.add('finally-frame')
  return {iframe, settings}
}
