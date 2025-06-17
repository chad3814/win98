'use browser';

function setupNavButtons(backElement, forwardElement, refreshElement, iframeElement) {
    // maintain a stack of urls that are visited in the iframe
    const stack = [iframeElement.src];

    // this is the index of the current url in the iframe
    let i = 0;

    // this lets us know if the user pushed a button or clicked a link
    let buttonPushed = true;

    // keep track of the event listeners on the back/forward buttons
    let hasBackHandler = false;
    let hasForwardHandler = false;

    // handle refresh clicks
    refreshElement.addEventListener('click', () => {
        // remember that it was button pushed
        buttonPushed = true;
        iframeElement.contentWindow.location.reload();
    })

    // this is the listener for going forward
    function goForward() {
        // make sure there's somewhere to go forward to
        if ((i + 1) >= stack.length) {
            console.error('goForward() called and there is no forward history');
            return;
        }

        // increment the index
        i++;
        
        // keep track that the button was pushed
        buttonPushed = true;

        // set the new url
        iframeElement.src = stack[i];
    }

    // this is the listener for going backward
    function goBackward() {
        // make sure there's somewhere to go backward to
        if (i <= 0) {
            console.error('goBackward() called and the is no backward history');
            return;
        }

        // decremetn the index
        i--;

        // keep track that we pushed the button
        buttonPushed = true;

        // set the url
        iframeElement.src = stack[i];
    }

    // this is the listener for when the url changes in the iframe
    function urlChangeHandler() {
        // if the button wasn't pushed
        if (!buttonPushed) {
            // truncate the stack where we are, if there were urls to go forward to,
            // there are not anymore
            stack.length = i + 1;

            // push the new url onto the stack
            stack.push(iframeElement.contentWindow.location.href);

            // increment the pointer
            i++;
        }

        // reset the button status
        buttonPushed = false;

        if (i <= 0) {
            // if we are at the beginning of the stack
            
            // add the disabled class to the button
            backElement.classList.add('nav-disabled');

            // remove the event handler
            backElement.removeEventListener('click', goBackward);

            // keep track that we removed the event handler
            hasBackHandler = false;
        } else {
            // if we are not at the beginning of the stack

            // remove the disabled class from the button
            backElement.classList.remove('nav-disabled');

            // add the event handler if needed
            if (!hasBackHandler) {
                backElement.addEventListener('click', goBackward);
                hasBackHandler = true;
            }
        }

        if ((i + 1) >= stack.length) {
            // if we are at the end of the stack

            // add the disabled class to the button
            forwardElement.classList.add('nav-disabled');

            // remove the event handler
            forwardElement.removeEventListener('click', goForward);

            // keep track that we removed the event handler
            hasForwardHandler = false;
        } else {
            // if we are not at the end of the stack

            // remove the disabled class from the button
            forwardElement.classList.remove('nav-disabled');

            // add the event handler if needed
            if (!hasForwardHandler) {
                forwardElement.addEventListener('click', goForward);
                hasForwardHandler = true;
            }
        }
    }

    // listen for the event
    iframeElement.addEventListener('load', urlChangeHandler);

    // handle the first one
    urlChangeHandler();
}

// once the document is loaded we can setup the nav buttons
function docLoaded() {
    const blog = document.querySelector('#blog-contents');
    const buttons = document.querySelectorAll('#explorer-icons .explorer-w-title');
    const back = buttons[0];
    const forward = buttons[1];
    const refresh = buttons[3];

    setupNavButtons(back, forward, refresh, blog);
}

if (document.readyState === 'complete') {
    docLoaded();
} else {
    document.addEventListener('load', docLoaded);
}
