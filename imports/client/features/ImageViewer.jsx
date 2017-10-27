import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import Icon from '../components/Icon';


@pureRender
class ImageViewer extends Component {
    static propTypes = {
        image: PropTypes.string,
        closeImage: PropTypes.func,
    };

    constructor(...args) {
        super(...args);
        this.state = {
            scale: 1,
            rotate: 0,
        };
    }

    renderImageViewer = () => {
        const { image } = this.props;
        let offsetX = 0;
        let offsetY = 0;
        const { scale, rotate } = this.state;

        return (
            <div className="image-viewer container-wrap">
                <div className="image-title">
                    <Icon icon="icon-guanbi" size={30} iconColor="#fff" onClick={this.props.closeImage} />
                </div>
                <img
                    src={image}
                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                    draggable
                    onDragStart={(event) => {
                        const img = document.createElement('img');
                        img.src = 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==';
                        event.dataTransfer.setDragImage(img, 0, 0);
                        offsetX = event.clientX - event.target.offsetLeft;
                        offsetY = event.clientY - event.target.offsetTop;
                    }}
                    onDragOver={(event) => {
                        event.target.style.left = `${event.clientX - offsetX}px`;
                        event.target.style.top = `${event.clientY - offsetY}px`;
                        event.target.style.right = undefined;
                        event.target.style.bottom = undefined;
                    }}
                    onClick={event => event.bubbles = false}
                />
                <div
                    className="image-tool"
                >
                    <span
                        onClick={() => this.setState({ scale: scale + 0.25 })}
                    >
                        <Icon icon="icon-fangda" size={30} iconColor="#fff" />
                    </span>
                    <span
                        onClick={() => this.setState({ scale: scale - 0.25 })}
                    >
                        <Icon icon="icon-suoxiao" size={30} iconColor="#fff" />
                    </span>
                    <span
                        onClick={() => this.setState({ rotate: rotate + 90 })}
                    >
                        <Icon icon="icon-xuanzhuan" size={30} iconColor="#fff" />
                    </span>
                </div>
            </div>
        );
    }

    render() {
        return this.renderImageViewer();
    }
}

export default ImageViewer;
