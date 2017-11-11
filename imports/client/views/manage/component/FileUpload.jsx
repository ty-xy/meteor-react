import React, { Component, PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Upload, Button, Icon } from 'antd';
import files from '../../../../schema/file';
import feedback from '../../../../util/feedback';


class FileUpload extends (PureComponent || Component) {
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
    componentWillReceiveProps() {
        const { fileList } = this.props;
        this.imgs = fileList;
        const _fileList = [];
        if (!this.state.upload) {
            (fileList || []).forEach((_id) => {
                // const querys = fileLists.filter((i) => (item === i._id));
                const querys = files.findOne({ _id }) || [];
                if (querys._id) {
                    querys.uid = querys._id;
                    _fileList.push(querys);
                }
            });
            if (fileList && fileList.length) {
                this.setState({ _fileList });
            }
        }
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
                    this.imgs.push(res);
                    changeUpdate(keyword, this.imgs);
                }
            });
        });
        reader.readAsDataURL(img);
    }
    handleChange = ({ file, fileList }) => {
        if (file.status === 'done') {
            this.getBase64(file.originFileObj, file);
        }
        const _fileList = fileList;
        this.setState({ _fileList, upload: true });
    }
    render() {
        const { _fileList } = this.state;
        const props = {
            // accept: 'image/*',
            action: '/',
            // beforeUpload: this.beforeUpload,
            onChange: this.handleChange,
            onRemove: this.handleRemove,
            className: 'e-mg-imgupload',
            fileList: _fileList,
        };
        // console.log('fileupload', this.props, _fileList);
        return (
            <div className="clearfix margin-bottom-30 e-mg-fileUpload">
                <p style={{ marginBottom: '10px' }}>{this.props.title}</p>
                <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> upload
                    </Button>
                </Upload>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('file');
    return {
        users: Meteor.user() || {},
        files: files.find().fetch(),
    };
})(FileUpload);

