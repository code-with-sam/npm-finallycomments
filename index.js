const frame = require('iframe-resizer')
const finallySystem = {}

finallySystem.init = () => {
    window.addEventListener('message', finallySystem.receiveMessage, false);
}

finallySystem.receiveMessage = (event) => {
  if (event.data.message == 'sign-in'){
    if (event.origin !== 'https://finallycomments.com' ) return;
    let iframe = document.querySelector('.finallycomments__frame')
    iframe.style = 'height: 600px; border: none;'
  }

  if (event.data.message == 'new-comment'){
    if (event.origin !== 'https://finallycomments.com' ) return;
    let frameOffset = finallySystem.getDistanceFromTop(document.querySelector('.finallycomments__frame'))
    let frameHeight = document.querySelector('.finallycomments__frame').getBoundingClientRect().height;

    if ( event.data.depth === undefined || event.data.depth === 0 ){
      document.documentElement.scrollTop = ( frameOffset +  frameHeight )
    } else {
      document.documentElement.scrollTop = ( event.data.offset +  frameOffset - 300)
    }
  }
}

finallySystem.getDistanceFromTop = (element) => {
    let yPos = 0;
    while(element) {
        yPos += (element.offsetTop);
        element = element.offsetParent;
    }
    return yPos;
}

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

  if(embedType === 'steem'){
    let urlParts = finallySystem.getPartsFromLink(url)
    finallyUrl = `https://finallycomments.com/thread/${urlParts.category}/${urlParts.author}/${urlParts.permlink}`
  }
  if(embedType === 'thread'){
    finallyUrl = `https://finallycomments.com/thread/finallycomments/@${settings.username}/${url}`
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
  return iframe
}

module.exports.loadFromSteemitUrl = (steemitUrl, options) => {
  let settings = Object.assign({generated: false}, options || {})
  return finallySystem.createFrame('steem', steemitUrl, settings)
}

module.exports.loadThread = (slug, username, options) => {
  if (username === undefined || typeof username !== 'string') throw 'Username must be specified when using appendTo - Thread'
  let settings = Object.assign({generated: true, username}, options || {})
  return finallySystem.createFrame('thread', slug, settings)
}

module.exports.appendTo = (selector, embedType, id, username, options) => {
  console.log(selector, embedType, id, username, options)
  if (typeof username !== 'string') options = username
  if(embedType === 'steem'){
    return document.querySelector(selector).appendChild(module.exports.loadFromSteemitUrl(id, options))
  }
  if(embedType === 'thread'){
    return document.querySelector(selector).appendChild(module.exports.loadThread(id, username, options))
  }
  throw 'embedType must be specificed - steem || api || custom'
}



module.exports.resize = ()  => {
  let selector = '.finallycomments__frame'
  frame.iframeResizer( {}, `${selector}`);
}

module.exports.init = () => {
  finallySystem.init()
}
