import xss from 'xss';
import base64 from 'base64-arraybuffer';
import fileType from 'file-type';
import expressions from './expressions';

const myXss = new xss.FilterXSS({
    whiteList: {
    },
});
const transparentImage = 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==';

function convertExpression(txt) {
    return txt.replace(
        /#\(([\u4e00-\u9fa5a-z]+)\)/g,
        (r, e) => {
            const index = expressions.default.indexOf(e);
            if (index !== -1) {
                return `<img class="expression-default-message" src="${transparentImage}" style="background-position: left ${-30 * index}px; background-image: url('/expressions.png')" onerror="this.style.display='none'" alt="${r}">`;
            }
            return r;
        },
    );
}
function handleXss(value) {
    return myXss.process(value);
}
function setPreview(message) {
    if (message.type === 'text') {
        message.preview = `${message.from.username}: ${convertExpression(message.content)}`;
    } else {
        message.preview = `${message.from.username}: [${message.type}]`;
    }
}
function handleText(message) {
    if (message.type === 'text') {
        message.content = convertExpression(handleXss(message.content));
    }
}
function handleFile(message) {
    if (message.type === 'file') {
        message.content = JSON.parse(message.content);
    }
}

// export
function handleReceiveMessage(message) {
    setPreview(message);
    handleText(message);
    handleFile(message);
}

function handleInitMessages(messages) {
    for (const message of messages) {
        setPreview(message);
        handleText(message);
        handleFile(message);
    }
}
function handleSendMessage(message) {
    setPreview(message);
    switch (message.type) {
    case 'text': {
        handleText(message);
        break;
    }
    case 'image': {
        const type = fileType(message.content);
        message.content = `data:image/${type.ext};base64,${base64.encode(message.content)}`;
        break;
    }
    case 'file': {
        message.content.url = '';
        message.content.size = 0;
        break;
    }
    default:
        break;
    }
}
function handleSendEndMessage(message) {
    setPreview(message);
    handleText(message);
    handleFile(message);
}
function handleHistoryMessages(messages) {
    for (const message of messages) {
        handleText(message);
        handleFile(message);
        message.isHistory = true;
    }
    if (messages.length > 0) {
        messages[messages.length - 1].isHistoryScrollTarget = true;
    }
}

export default {
    convertExpression,
    handleReceiveMessage,
    handleInitMessages,
    handleSendMessage,
    handleSendEndMessage,
    handleHistoryMessages,
};
