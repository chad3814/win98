'use browser';

function setupScrollbar(iframeElement, scrollbarElement) {
    // this is the element that actually scrolls within the iframe
    // it gets set and changed in the urlChangeHandler() below
    let scrollingElement = null;

    // this takes the measurements and updates the scrollbarElement
    function updateScrollBar() {
        if (!scrollingElement) {
            console.error('no scrolling element');
            return;
        }

        // height is the total height in pixels of the scrolling area
        // including unseen parts
        const height = scrollingElement.scrollHeight;

        // top is how far down the scrolling area is scrolled, or
        // you can think of it as how much of the top of the scrolling
        // area is hidden off the top
        const top = scrollingElement.scrollTop;

        // scrollSize is the most area that can be hidden off the top
        const scrollSize = scrollingElement.scrollTopMax;

        // the size of the scrollbar area
        const scrollbarHeight = scrollbarElement.getBoundingClientRect().height;

        // this is how many pixels high that can be seen
        const viewHeight = height - scrollSize;

        // top / height is the percentage of the scrolling element that is hidden
        // so * scrollbarHeight gives us the margin for the top in pixels
        const topMargin = top / height * scrollbarHeight;

        // viewHeight / height is the percentage of the scrolling element that
        // will always be seen, so scale the scrollbar to that
        const size = viewHeight / height * scrollbarHeight;

        // the bottomMargin is what is left over
        const bottomMargin = scrollbarHeight - (topMargin + size);

        // now just need to set the top and bottom margins, and the scrollbar height
        scrollbarElement.style.height = `${size}px`;
        scrollbarElement.style.marginTop = `${topMargin}px`;
        scrollbarElement.style.marginBottom = `${bottomMargin}px`;
    }

    // whenever the url of the iframe changes (user navigates to a new blog post)
    // fire this function to update the scrolling element and setup the scroll
    // event handler
    function urlChangeHandler() {
        scrollingElement = iframeElement.contentDocument?.scrollingElement;
        if (!scrollingElement) {
            console.error('couldn\'t find the scrolling element of the iframe', iframeElement, iframeElement.contentDocument, iframeElement.contentDocument.scrollingElement);
            return;
        }
        updateScrollBar();
        iframeElement.contentDocument.addEventListener('scroll', updateScrollBar);
    }
    
    // listen for the event
    iframeElement.addEventListener('load', urlChangeHandler);

    // handle the first one
    urlChangeHandler();
}

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

if (document.readyState === 'complete') {
    docLoaded();
} else {
    document.addEventListener('load', docLoaded);
}
