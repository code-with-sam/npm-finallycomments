# npm-finallycomments

This is the official npm package for [Finallycomments](https://finallycomments.com).

## Installation

To install this library run: `npm install finallycomments --save`

## Methods

`init()` : Adds an event listener to the window for 'message' used to resize the iframe to full height of contents on load. Looks for any Finally embed code on the page (this embed code is HTML generated on [https://finallycomments.com](https://finallycomments.com])), if embed code is found with the class `finally-comments` it will be automatically loaded.

`loadEmbed(selector)` : load the finally iframe for HTML code where you have changed the selector.

`loadFromSteemitUrl(steemitUrl, options)` : returns an iframe html node

`loadThread(slug, username, options)` : returns an iframe html node

`appendTo(selector, embedType, id, username, options)` : Creates an iframe from the parameters and uses `appendChild` to insert the frame into the DOM using the selector specified.

`directThreadLink(embedType, url, options)` : returns a url String that links to the Finally thread viewer.

## Examples

### init()
Any embeds found on page with class `finally-comments` will be loaded. Event Listener added to Window for incoming messages from frame parent (used to resize iframe).
```
import finallycomments from 'finallycomments'
finallycomments.init()
```

### loadEmbed(selector)
Example HTML on Page -
```
<section class="post__comments"
    data-id="https://steemit.com/utopian-io/@sambillingham/introducing-move-club-get-rewarded-for-working-out"
    data-reputation="true"
    data-values="true"
    data-profile="true"
    data-generated="false"
    data-beneficiary="username"
    data-beneficiaryWeight="10">
</section>
```

```
import finallycomments from 'finallycomments'
finallycomments.init()
finallycomments.loadEmbed('.post__comments')
```


The options object is optional.

### loadFromSteemitUrl(steemitUrl, options)
```
import finallycomments from 'finallycomments'
finallycomments.init()
let iframe = finallycomments.loadFromSteemitUrl('https://steemit.com/utopian-io/@sambillingham/finally-comments-api-and-new-dashboard-features')
```

### loadThread(slug, username, options)
```
import finallycomments from 'finallycomments'
finallycomments.init()
let thread = finallycomments.loadThread('finally-hellomars', 'sambillingham', {values: false})
```

### appendTo(selector, embedType, id, username, options)
```
import finallycomments from 'finallycomments'
finallycomments.init()
let options = {
  values: true,
  reputation: false,
  profile: false,
  beneficiary: 'finallycomments',
  beneficiaryWeight: '30'
}
finallycomments.appendTo('main', 'thread', 'finally-hellomars', 'sambillingham', options)
```

### directThreadLink(embedType, url, options)
```
import finallycomments from 'finallycomments'
finallycomments.init()
let href = finallycomments.directThreadLink('steem', 'https://steemit.com/utopian-io/@sambillingham/finally-comments-api-and-new-dashboard-features')
let link = `<a href="${href}">Check out this discussion we has on Steem yesterday</a>`
````

## Contribution

If you want to contribute to this package create a fork, make your changes and create a pull request.


## Change Log
- v0.3.0 - comment beneficiary support
- v0.2.1 - post-message not recongised without correct message property
- v0.2.0 - add autoload support for embeds found on page
- v0.1.2 - fixed issue with incorrect variable names for urlParts
- v0.1.1 - remove sign-in window message. Not needed with the new popup auth flow.
