import React from 'react';
import PropTypes from 'prop-types';
import expressions from '../../../../../util/expressions';


const transparentImage = 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==';
const convertExpression = txt => ({
    __html: txt.replace(
        /#\(([\u4e00-\u9fa5a-z0-9-]+)\)/g,
        (r, e) => {
            const index = expressions.default.indexOf(e);
            if (index !== -1) {
                return `<img class="expression-default-message" src="${transparentImage}" style="background-position: left ${-30 * index}px" onerror="this.style.display='none'" alt="${r}">`;
            }
            return r;
        },
    ).replace(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
        r => (
            `<a href="${r}" rel="noopener noreferrer" target="_blank">${r}</a>`
        ),
    ),
});

const RenderText = ({ content }) => (
    <div className="user-message" dangerouslySetInnerHTML={convertExpression(content)} />
);

RenderText.propTypes = {
    content: PropTypes.string,
};

export default RenderText;
