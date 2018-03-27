const frame = require('iframe-resizer')

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
  Object.keys(settings).map((key, index) => settings[key] = settings[key].toString() );
  let iframe = document.createElement('iframe', { scrolling: 'no' })
  let urlParts = finallySystem.getPartsFromLink(steemitUrl)
  iframe.src = `https://finallycomments.com/thread/${urlParts.category}/${urlParts.author}/${urlParts.permlink}`
  iframe.width = '100%'
  iframe.style = 'border: none;'
  iframe.classList.add('finallycomments__frame')
  iframe.onload = () => {
    document.querySelector('.finallycomments__frame').contentWindow.postMessage(settings,'*')
    frame.iframeResizer( {}, '.finallycomments__frame');
  }
  return {iframe, settings}
}

module.exports.resize = ()  => {
  let selector = '.finallycomments__frame'
  frame.iframeResizer( {}, `${selector}`);
}
