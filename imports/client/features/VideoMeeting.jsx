import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';

import Icon from '../components/Icon';

@pureRender
class VideoMeeting extends Component {
    static propTypes = {
        closeVideo: PropTypes.func,
    }
    componentDidMount() {
        if (this.hasUserMedia()) {
            navigator.getUserMedia({ video: true, audio: false },
                (localMediaStream) => {
                    const selfVideo = this.$selfVideo;
                    selfVideo.src = window.URL.createObjectURL(localMediaStream);
                    selfVideo.onloadedmetadata = function () {
                        console.log(`Label: ${localMediaStream.label}`);
                        console.log('AudioTracks', localMediaStream.getAudioTracks());
                        console.log('VideoTracks', localMediaStream.getVideoTracks());
                    };
                    if (this.hasRTCPeerConnection()) {
                        this.startPeerConnection(localMediaStream);
                    } else {
                        alert('没有RTCPeerConnection API');
                    }
                },
                (err) => {
                    console.log(err);
                });
        } else {
            alert('没有userMedia API');
        }
    }
    hasUserMedia = () => {
        navigator.getUserMedia = navigator.getUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        return !!navigator.getUserMedia;
    }
    hasRTCPeerConnection = () => {
        window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.msRTCPeerConnection;
        return !!window.RTCPeerConnection;
    }
    // 建立传输视频数据所需要的 ICE 通信路径
    startPeerConnection = (stream) => {
        // 这里使用了几个公共的stun协议服务器
        const config = {
            iceServers: [
                { url: 'stun:stun.services.mozilla.com' },
                { url: 'stun:stunserver.org' },
                { url: 'stun:stun.l.google.com:19302' },
            ],
        };
        const selfConnection = new RTCPeerConnection(config);
        const otherConnection = new RTCPeerConnection(config);
        selfConnection.onicecandidate = (e) => {
            if (e.candidate) {
                otherConnection.addIceCandidate(new RTCIceCandidate(e.candidate));
            }
        };
        otherConnection.onicecandidate = (e) => {
            if (e.candidate) {
                selfConnection.addIceCandidate(new RTCIceCandidate(e.candidate));
            }
        };
        const otherVideo = this.$otherVideo;
        otherConnection.onaddstream = (e) => {
            otherVideo.src = window.URL.createObjectURL(e.stream);
        };
        selfConnection.addStream(stream);
        // 本方产生了一个offer
        selfConnection.createOffer()
            .then((offer) => {
                selfConnection.setLocalDescription(offer);
                // 对方接收到这个offer
                otherConnection.setRemoteDescription(offer);
                // 对方产生一个answer
                // 通过socket传递给指定socketId
                otherConnection.createAnswer()
                    .then((answer) => {
                        otherConnection.setLocalDescription(answer);
                        // 本接收到这个offer
                        selfConnection.setRemoteDescription(answer);
                    });
            });
    }
    render() {
        return (
            <div className="video-wrap container-wrap " >
                <div className="container-middle">
                    <video ref={i => this.$selfVideo = i} autoPlay className="self-video" >
                     您的浏览器不支持 video 标签。
                    </video>
                    <video ref={i => this.$otherVideo = i} autoPlay className="other-video" >
                    您的浏览器不支持 video 标签。
                    </video>
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

export default VideoMeeting;
