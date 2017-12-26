let theobject = null; // This gets a value as soon as a resize start
// if (typeof (window.event) === 'undefined') {
//     const $E = function () { let c = $E.caller; while (c.caller)c = c.caller; return c.arguments[0]; };
//     window.__defineGetter__('event', $E);
// }

function resizeObject() {
    this.el = null; // pointer to the object
    this.dir = ''; // type of current resize (n, s, e, w, ne, nw, se, sw)
    this.grabx = null; // Some useful values
    this.graby = null;
    this.width = null;
    this.height = null;
    this.left = null;
    this.top = null;
}


// Find out what kind of resize! Return a string inlcluding the directions
function getDirection(el) {
    let dir;
    dir = '';

    const xPos = window.event.offsetX;
    const yPos = window.event.offsetY;

    const offset = 8; // The distance from the edge in pixels

    if (yPos < offset) dir += 'n';
    else if (yPos > el.offsetHeight - offset) dir += 's';
    if (xPos < offset) dir += 'w';
    else if (xPos > el.offsetWidth - offset) dir += 'e';

    return dir;
}

function getReal(el, type, value) {
    let temp = el;
    while ((temp !== null) && (temp.tagName !== 'BODY')) {
        if (`temp.${type}` === value) {
            el = temp;
            return el;
        }
        temp = temp.parentElement;
    }
    return el;
}

function doDown() {
    const el = getReal(event.srcElement, 'className', 'resizeMe');

    if (el == null) {
        theobject = null;
        return;
    }

    const dir = getDirection(el);
    if (dir === '') return;

    theobject = new resizeObject();

    theobject.el = el;
    theobject.dir = dir;

    theobject.grabx = window.event.clientX;
    theobject.graby = window.event.clientY;
    theobject.width = el.offsetWidth;
    theobject.height = el.offsetHeight;
    theobject.left = el.offsetLeft;
    theobject.top = el.offsetTop;

    window.event.returnValue = false;
    window.event.cancelBubble = true;
}

function doUp() {
    if (theobject !== null) {
        theobject = null;
    }
}

function doMove() {
    let str;
    // const xMin = 8; // The smallest width possible
    const yMin = 8; //             height

    const el = getReal(event.srcElement, 'className', 'resizeMe');

    if (el.className === 'resizeMe') {
        str = getDirection(el);
        // Fix the cursor
        if (str === '') str = 'default';
        else str += '-resize';
        el.style.cursor = str;
    }

    // Dragging starts here
    if (theobject !== null) {
        // if (theobject.dir.indexOf('e') !== -1) { theobject.el.style.width = `${Math.max(xMin, theobject.width + window.event.clientX - theobject.grabx)}px`; }

        if (theobject.dir.indexOf('s') !== -1) { theobject.el.style.height = `${Math.max(yMin, theobject.height + window.event.clientY - theobject.graby)}px`; }

        if (theobject.dir.indexOf('w') !== -1) {
            // theobject.el.style.left = `${Math.min(theobject.left + window.event.clientX - theobject.grabx, theobject.left + theobject.width - xMin)}px`;
            // theobject.el.style.width = `${Math.max(xMin, theobject.width - window.event.clientX + theobject.grabx)}px`;
        }
        if (theobject.dir.indexOf('n') !== -1) {
            // theobject.el.style.top = `${Math.min(theobject.top + window.event.clientY - theobject.graby, theobject.top + theobject.height - yMin)}px`;
            theobject.el.style.height = `${Math.max(yMin, theobject.height - window.event.clientY + theobject.graby)}px`;
            const heightOther = document.getElementsByClassName('chat-send-bts');
            console.log('heightOther', heightOther);
            if (heightOther) {
                heightOther[0].style.height = `${Math.max(yMin, theobject.height - window.event.clientY + theobject.graby) - 30}px`;
            }
        }

        window.event.returnValue = false;
        window.event.cancelBubble = true;
    }
}

module.exports = {
    doDown,
    doUp,
    doMove,
};
