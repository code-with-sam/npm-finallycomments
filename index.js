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
finallySystem.createFrame = (embedType, url, options) => {
  let settings = {
    message: 'finally-frame-load',
    reputation: true,
    profile: true,
    values: true
  }
  settings = Object.assign(settings, options || {})
  Object.keys(settings).map((key, index) => settings[key] = settings[key].toString() );
  let finallyUrl;

  if(embedType === 'steem' || embedType === 'custom'){
    let urlParts = finallySystem.getPartsFromLink(url)
    finallyUrl = `https://finallycomments.com/thread/${urlParts.category}/${urlParts.author}/${urlParts.permlink}`
  }
  if(embedType === 'api'){
    finallyUrl = url
  }

  let iframe = document.createElement('iframe', { scrolling: 'no' })
  iframe.src = finallyUrl
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
