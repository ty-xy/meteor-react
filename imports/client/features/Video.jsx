import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';

import Icon from '../components/Icon';

@pureRender
class Video extends Component {
    static propTypes = {
        closeVideo: PropTypes.func,
    }
    componentDidMount() {
        const getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        getUserMedia.call(navigator, {
            video: true,
            audio: true,
        }, (localMediaStream) => {
            const video = this.$video;
            video.src = window.URL.createObjectURL(localMediaStream);
            video.onloadedmetadata = function () {
                console.log(`Label: ${localMediaStream.label}`);
                console.log('AudioTracks', localMediaStream.getAudioTracks());
                console.log('VideoTracks', localMediaStream.getVideoTracks());
            };
        }, (e) => {
            console.log('Reeeejected!', e);
        });
    }
    render() {
        return (
            <div className="video-wrap container-wrap " >
                <div className="container-middle">
                    <video ref={i => this.$video = i} autoPlay />
                    <div className="video-features">
                        <ul className="video-feature">
                            <li>
                                <Icon icon="icon-yangshengqi" iconColor="#fff" size={30} />
                                <p>关闭扬声器</p>
                            </li>
                            <li>
                                <Icon icon="icon-tubiao-" iconColor="#fff" size={30} />
                                <p>关闭麦克风</p>
                            </li>
                            <li>
                                <Icon icon="icon-dakaishipin" iconColor="#fff" size={30} />
                                <p>关闭视频</p>
                            </li>
                        </ul>
                        <button onClick={this.props.closeVideo}>结束视频</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Video;
