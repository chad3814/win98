# Some Win98 javascript

============

These are for Ang I guess. Her indie web site at https://angs-corner.nekoweb.org/blog/home imitates Win98, but I thought the scrollbar should work, and then I thought the forward and back buttons should work.

So I guess I wrote javascript to do those things.

## Usage

Ang, if you want to use these, add the js files to your site, and there are some CSS changes:

* you will need to make a disabled state for the nav buttons, the class name I used is `nav-disabled`
* in scrollbar.js there's a couple styles that you could change, see the `docLoaded()`:

```javascript
// once the document is loaded we can setup the scrollbar events
function docLoaded() {
    const blog = document.querySelector('#blog-contents');
    const sb = document.querySelector('#browser-scroll-bar .scrollbar');

    // if you make these changes to the css, remove these
    sb.style.flexGrow = 1;
    sb.parentElement.style.justifyContent = '';

    // setup
    setupScrollbar(blog, sb);
}
```
