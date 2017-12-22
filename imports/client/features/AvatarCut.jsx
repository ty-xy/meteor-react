import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { Button, Modal } from 'antd';


import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';


@pureRender
class AvatarCut extends Component {
    static propTypes = {
        handleAvatar: PropTypes.func,
        showAvatarCut: PropTypes.func,
        visible: PropTypes.bool,
        avatarDate: PropTypes.string,
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    _crop = () => {
        this.setState({
            imgData: this.cropper.getCroppedCanvas().toDataURL(),
        });
    }
    handleOkCut = () => {
        const { handleAvatar } = this.props;
        handleAvatar(this.state.imgData);
    }
    render() {
        const { visible, showAvatarCut, avatarDate } = this.props;
        return (
            <Modal
                title="头像设置"
                visible={visible}
                onCancel={() => showAvatarCut(false)}
                wrapClassName="create-team-mask"
                footer={null}
                width={600}
                style={{ top: 20 }}
            >
                <Cropper
                    ref={i => this.cropper = i}
                    src={avatarDate}
                    style={{ height: 300, width: '100%' }}
                    aspectRatio={16 / 16}
                    guides={false}
                    crop={this._crop}
                />
                <p style={{ color: '#999', marginTop: '5px' }}><span style={{ color: '#ef5350' }}>* </span>滚动可拖放大小哦！</p>
                <div className="text-center margin-top-20"><Button type="primary" onClick={this.handleOkCut}>确定上传</Button></div>
            </Modal>
        );
    }
}

export default AvatarCut;
