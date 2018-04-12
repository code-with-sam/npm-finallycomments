# npm-finallycomments

This is the official npm package for [Finallycomments](https://finallycomments.com).

## Installation

To install this library run: `npm install finallycomments --save`

## Methods

`init()` : Adds an event listener to the window for 'message' used to resize the iframe to full height of contents on load.

`loadFromSteemitUrl(steemitUrl, options)` : returns an iframe html node

`loadThread(slug, username, options)` : returns an iframe html node

`appendTo(selector, embedType, id, username, options)` : Creates an iframe from the parameters and uses `appendChild` to insert the frame into the DOM using the selector specified.

`directThreadLink(embedType, url, options)` : returns a url String that links to the Finally thread viewer.

## Examples
The options object is optional.

### loadFromSteemitUrl(steemitUrl, options)
```
let iframe = loadFromSteemitUrl('https://steemit.com/utopian-io/@sambillingham/finally-comments-api-and-new-dashboard-features')
```

### loadThread(slug, username, options)
```
let thread = finallycomments.loadThread('finally-hellomars', 'sambillingham', {values: false})
```

### appendTo(selector, embedType, id, username, options)
```
let options = {
  values: true,
  reputation: false,
  profile: false
}
finallycomments.appendTo('main', 'thread', 'finally-hellomars', 'sambillingham', options)
```

### directThreadLink(embedType, url, options)
```
let href = directThreadLink('steem', 'https://steemit.com/utopian-io/@sambillingham/finally-comments-api-and-new-dashboard-features')
let link = `<a href="${href}">Check out this discussion we has on Steem yesterday</a>`
````

## Contribution

If you want to contribute to this package create a fork, make your changes and create a pull request.


## Chnage Log
v0.1.1 - remove sign-in window message. Not needed with the new popup auth flow.
