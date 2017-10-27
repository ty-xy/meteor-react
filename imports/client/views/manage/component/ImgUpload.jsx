import React, { Component, PureComponent } from 'react';
import { Upload, Modal } from 'antd';
import MyIcon from '../../../components/Icon';

// import qiniu from 'qiniu';

// const accessKey = 'ptgtsBOAlMf_mihyVKf6Zbjor7JgiSs2wWM7zj4b';
// const secretKey = 'ZN6cH2DawqguO-sQFL7AaDnldpvGNl6Vt7iCd9G_';
// const domain = '//oxldjnom8.bkt.clouddn.com/';
// const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
// const putPolicy = new qiniu.rs.PutPolicy({ scope: 'ejianlian', expires: 60 * 60 * 24 * 30 });

// const qiniuConfig = new qiniu.conf.Config();
// qiniuConfig.zone = qiniu.zone.Zone_z1;

// const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
// const putExtra = new qiniu.form_up.PutExtra();

// function getToken() {
//     return putPolicy.uploadToken(mac);
// }

// let token = getToken();
// // update token
// setInterval(() => {
//     token = getToken();
// }, 1000 * 60 * 60 * 24 * 20);


class ImgUpload extends (PureComponent || Component) {
  state = {
      previewVisible: false,
      previewImage: '',
      fileList: [{
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
      this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
      });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })
  render() {
      const { previewVisible, previewImage, fileList } = this.state;
      const uploadButton = (
          <div>
              <MyIcon icon="icon-tupian-copy" size={32} />
          </div>
      );
      const QINIU_SERVER = 'http://up.qiniu.com';
      const data = {
          token: 'ptgtsBOAlMf_mihyVKf6Zbjor7JgiSs2wWM7zj4b',
      };
      //   console.log(uploadBytes);
      return (
          <div className="clearfix">
              <p style={{ marginBottom: '10px' }}>{this.props.title}</p>
              <Upload
                  action={QINIU_SERVER}
                  data={data}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                  className="e-mg-imgupload"
              >
                  {fileList.length >= 5 ? null : uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
          </div>
      );
  }
}

export default ImgUpload;

