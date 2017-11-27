import React, { Component, PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import { Upload, Modal } from 'antd';
import MyIcon from '../../../../../components/Icon';
import feedback from '../../../../../../util/feedback';


class ImgUp extends (PureComponent || Component) {
    constructor(props) {
        super(props);

        this.state = {
            upload: false,
            previewVisible: false,
            previewImage: '',
            _fileList: [],
            beforeState: true,
            token: '',
        };
        this.imgs = [];
    }
    componentWillMount() {
        const _this = this;
        this.imgs = this.props.fileList;
        Meteor.call(
            'createToken',
            (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    _this.setState({ token: res.token });
                }
            },
        );
    }
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    handleRemove = (e) => {
        const { removeUpload, keyword } = this.props;
        this.imgs = this.imgs.filter((item) => {
            if (e.response) {
                return item !== e.response.key;
            }
            return item !== e.uid;
        });
        removeUpload(this.imgs, keyword);
    }
    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG || !isLt2M) {
            feedback.dealWarning('You can only upload JPG file!');
        }
        return isJPG && isLt2M;
    }
    getBase64 = (img, file) => {
        const { changeUpdate, keyword } = this.props;
        const name = file.name;
        const fileType = file.type;
        const type = fileType.slice(fileType.lastIndexOf('/') + 1) || '';
        const size = file.size;
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            Meteor.call('insertFile', name, type, size, reader.result, (err, res) => {
                if (err) {
                    feedback.dealError(err);
                } else {
                    feedback.successToast('上传成功');
                    changeUpdate(keyword, res);
                }
            });
        });
        reader.readAsDataURL(img);
    }
    handleChange = ({ file, fileList }) => {
        const { changeUpdate, keyword } = this.props;
        if (file.status === 'done') {
            // this.getBase64(file.originFileObj, file);
            if (file.response) {
                this.imgs.push(file.response.key);
            }
            changeUpdate(keyword, this.imgs);
        }
        this.setState({ fileList });
    }
    render() {
        const { previewVisible, previewImage, token } = this.state;
        const { fileList } = this.props;
        const defaultImg = fileList.map(item => ({
            uid: item,
            name: `${item}`,
            status: 'done',
            url: `http://oxldjnom8.bkt.clouddn.com/${item}`,
        }));
        const uploadButton = (
            <div style={{ marginTop: '-4px' }}>
                <MyIcon icon="icon-tupian-copy" size={28} />
            </div>
        );
        const props = {
            accept: 'image/*',
            action: 'http://up-z1.qiniu.com',
            listType: 'picture-card',
            onPreview: this.handlePreview,
            // beforeUpload: this.beforeUpload,
            data: {
                token,
            },
            onChange: this.handleChange,
            onRemove: this.handleRemove,
            className: 'e-mg-imgupload',
            defaultFileList: defaultImg,
        };
        return (
            <div className="clearfix margin-bottom-10">
                <p style={{ marginBottom: '10px' }}>{this.props.title}</p>
                <Upload
                    {...props}
                >
                    {this.imgs.length === 0 ? uploadButton : null}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default ImgUp;
