const frame = require('iframe-resizer')
const finallySystem = {}

finallySystem.init = () => {
    window.addEventListener('message', finallySystem.receiveMessage, false);
    finallySystem.checkForEmbedSelector('.finally-comments')
}

finallySystem.receiveMessage = (event) => {
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

finallySystem.getUrlParams = (embedType,  url, options) => {
  if(embedType === 'steem') return finallySystem.getPartsFromLink(url)
  if(embedType === 'thread') return { permlink: `${url}`, author: `@${options.username}`, category: 'finallycomments' }
  return false
}

finallySystem.createFrame = (embedType, url, options) => {
  const urlParams = finallySystem.getUrlParams(embedType, url, options)
  const settings = Object.assign({generated: 'false', message: 'finally-frame-load'}, options)
  let iframe = document.createElement('iframe', { scrolling: 'no' })
  iframe.src = embedType === 'api' ? url : `https://finallycomments.com/thread/${urlParams.category}/${urlParams.author}/${urlParams.permlink}`
  iframe.width = '100%'
  iframe.style = 'border: none;'
  iframe.classList.add('finallycomments__frame')
  iframe.onload = () => {
    document.querySelector('.finallycomments__frame').contentWindow.postMessage(settings,'*')
    frame.iframeResizer({}, '.finallycomments__frame');
  }
  return iframe
}

finallySystem.loadEmbed = (selector) => {
  let container = document.querySelector(selector)
  let embedType = container.dataset.api === 'true' ? 'api' : 'steem'
  let url = container.dataset.id
  let options = {
    reputation: container.dataset.reputation,
    profile: container.dataset.profile,
    values: container.dataset.values,
    generated: container.dataset.generated,
    beneficiary: container.dataset.beneficiary,
    beneficiaryWeight: container.dataset.beneficiaryWeight,
    guestComments: container.dataset.guestComments
  }
  let iframe = finallySystem.createFrame(embedType, url, options)
  container.appendChild(iframe)
}

finallySystem.checkForEmbedSelector = (selector) => {
  let embedFound = document.querySelector(selector) !== null ? true : false
  if (embedFound) finallySystem.loadEmbed(selector)
}

module.exports.loadFromSteemitUrl = (steemitUrl, options) => {
  return finallySystem.createFrame('steem', steemitUrl, options)
}

module.exports.loadThread = (slug, username, options) => {
  if (username === undefined || typeof username !== 'string') throw 'Username must be specified when using appendTo - Thread'
  let settings = Object.assign({generated: 'true', username}, options)
  return finallySystem.createFrame('thread', slug, settings)
}

module.exports.appendTo = (selector, embedType, id, username, options) => {
  if (typeof username !== 'string') options = username
  if(embedType === 'steem'){
    return document.querySelector(selector).appendChild(module.exports.loadFromSteemitUrl(id, options || {}))
  }
  if(embedType === 'thread'){
    return document.querySelector(selector).appendChild(module.exports.loadThread(id, username, options || {}))
  }
  throw 'embedType must be specificed as "steem" or "thread"'
}


module.exports.directThreadLinkFromURL = (url) => {
  const urlParams = finallySystem.getPartsFromLink(url)
  return `https://finallycomments.com/viewer/steem-post/${urlParams.category}/${urlParams.author}/${urlParams.permlink}`
}

module.exports.directThreadLinkFromID = (id, username) => {
  const urlParams = { permlink: id, author: `@${username}`, category: 'finallycomments' }
  return `https://finallycomments.com/viewer/custom-thread/${urlParams.category}/${urlParams.author}/${urlParams.permlink}`
}

module.exports.loadEmbed = (selector) => {
  let embedFound = document.querySelector(selector) !== null ? true : false
  if (embedFound){
    finallySystem.loadEmbed(selector)
  } else {
    throw `Embed Code must be included and selector must match - ${selector}`
  }
}

module.exports.init = () => {
  finallySystem.init()
}

window['finallyComments'] = module.exports
