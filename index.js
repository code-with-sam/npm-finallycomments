// const frame = require('iframe-resizer')

let finallySystem = {}

finallySystem.getPartsFromLink = (url) => {
    let lastChar = url.substr(url.length -1);
    if (lastChar === '/') url = url.slice(0, -1);
    let parts = url.split('/')
    return {
      permlink: parts.pop(),
      author: parts.pop(),
      category: parts.pop()
    }
}
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
  let urlParts = finallySystem.getPartsFromLink(steemitUrl)
  iframe.src = `https://finallycomments.com/thread/${urlParts.category}/${urlParts.author}/${urlParts.permlink}`
  iframe.width = '100%'
  iframe.style = 'border: none;'
  iframe.classList.add('finally-frame')
  return {iframe, settings}
}
