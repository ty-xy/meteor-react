import React, { Component } from 'react';
import { Row, Col, Input, Checkbox } from 'antd';
import pureRender from 'pure-render-decorator';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
// import format from 'date-format';

import feedback from '../../../../../util/feedback';
import formatDate from '../../../../../util/formatDate';
import Icon from '../../../../components/Icon';
import PopulateUtil from '../../../../../util/populate';
import File from '../../../../../../imports/schema/file';
import FileIcon from '../../../../components/FileIcon';
import ProjectFile from '../../../../../../imports/schema/projectfile';

const Search = Input.Search;
@pureRender
class projectTask extends Component {
    static propTypes = {
        pId: PropTypes.string,
        projectfile: PropTypes.arrayOf(PropTypes.object),
        //  projectd: PropTypes.arrayOf(PropTypes.object),
    }
    constructor(...props) {
        super(...props);
        this.state = {
            indeterminate: true,
            checkAll: false,
            checkedList: false,
            length: '',
        };
        this.checkList = [];
    }
    onChangeL=(e, I) => {
        if (e.target.checked === true) {
            this.checkList.push(I);
            this.setState({
                [`checkedList${I}`]: true,
            });
        } else {
            const index = this.checkList.indexOf(I);
            this.checkList.splice(index, 1);
            this.setState({
                [`checkedList${I}`]: false,
            });
        }
        this.setState({
            checkAll: this.checkList.length === this.props.projectfile.length,
            length: this.checkList.length,
        });
    }
      onCheckAllChange = (e) => {
          this.setState({
              checkAll: e.target.checked,
          });
          const list = [];
          this.props.projectfile.map((item) => {
              this.setState({
                  [`checkedList${item._id}`]: e.target.checked,
              });
              list.push(item._id);
              return null;
          });
          this.checkList = e.target.checked ? list : [];
      }
      sendFile = () => {
          this.fileInput.click();
      }
    selectFile = () => {
        const file = this.fileInput.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        const name = file.name;
        const fileType = file.type;
        const type = fileType.slice(fileType.lastIndexOf('/') + 1) || '';
        const size = file.size;
        const createProjectFile = this.createProjectFile;

        reader.onloadend = function () {
            Meteor.call('insertFile', name, type, size, this.result, (err, res) => {
                feedback.dealError(err);
                if (res) {
                    createProjectFile(res);
                }
            });
        };
        reader.readAsDataURL(file);
    }
    handleRemoveFile=(id) => {
        Meteor.call(
            'deleteProjectFile', id, (err) => {
                console.log(err);
            },
        );
    }
    handleRList = (id) => {
        feedback.dealDelete('提示', '确定要删除该文件吗?', () => this.handleRemoveFile(id));
    }
    createProjectFile = (fileId) => {
        Meteor.call(
            'createProjectFile',
            {
                projectId: this.props.pId,
                fileId,
            },
            (err) => {
                feedback.dealError(err);
                console.log(err);
            });
    }
    handleRemoveTotal = () => {
        if (this.state.checkAll === true) {
            this.checkList.forEach((value) => {
                if (value) {
                    this.handleRemoveFile(value);
                }
            });
        }
    }
    handleRemoveTotalList = () => {
        feedback.dealDelete('提示', '确定要删除该文件吗?', this.handleRemoveTotal);
    }
   handleDown =() => {
       if (this.state.checkAll === true) {
           const a = document.createElement('a');
           this.props.projectfile.map((item) => {
               a.setAttribute('href', item.url);
               a.setAttribute('download', item.name);
               a.click();
               return null;
           });
       }
   }

   render() {
       return (
           <div>
               <Row className="project-file-wenjian">
                   <Col span={16}>
                       <p className="wenjian-name">
                 项目文件
                       </p>
                   </Col>
                   <Col span={6} style={{ textAlign: 'right' }}>
                       <Search
                           placeholder="搜索文件"
                           style={{ width: 250 }}
                       />
                   </Col>
                   {/* <Col span={2}>
                            <button className="new-button">
                        新建文件夹
                            </button>
                        </Col> */}
                   <Col span={2} style={{ textAlign: 'center' }}>
                       <button className="up-button" onClick={this.sendFile}>
                          上传
                       </button>
                       <input
                           className="input-file"
                           type="file"
                           ref={i => this.fileInput = i}
                           onChange={this.selectFile}
                       />
                   </Col>
               </Row>
               <div className="file-detail">
                   <Row className="file-detail-title">
                       <Col span={8}>
                           <Row>
                               <Col span={4}>
                                   <Checkbox
                                       onChange={this.onCheckAllChange}
                                       checked={this.state.checkAll}
                                   >名称</Checkbox>
                               </Col>
                               <Col span={8}>
                                     （已选择 {this.state.length || 0} 项目）
                               </Col>
                               <Col span={3} className="down-load  file-load" onClick={this.handleDown}>
                                   下载
                               </Col>
                               <Col
                                   span={3}
                                   className="down-load  file-remove"
                                   onClick={this.handleRemoveTotal}
                               >
                                    删除
                               </Col>
                           </Row>
                       </Col>
                       <Col span={8}>
                           <Row>
                               <Col span={8}>大小</Col>
                               <Col span={8}>创建者</Col>
                               <Col span={8}>时间</Col>
                           </Row>
                       </Col>
                       <Col span={8} style={{ textAlign: 'center' }} />
                   </Row>
                   <ul>
                       {this.props.projectfile.map((item) => {
                           console.log('');
                           return (
                               <li className="detail-list-wenjian" key={item._id}>
                                   <Row className="file-detail-title" key={item._id}>
                                       <Col span={8}>
                                           <Row>
                                               <Col span={4} style={{ display: 'flex' }} >
                                                   <Checkbox
                                                       onChange={e => this.onChangeL(e, item._id)}
                                                       checked={this.state[`checkedList${item._id}`]}
                                                   />
                                                   <div className="file-geshi">
                                                       <FileIcon type={item.type} />
                                                   </div>
                                               </Col>
                                               <Col>{item.name}</Col>
                                           </Row>
                                       </Col>
                                       <Col span={8}>
                                           <Row>
                                               <Col span={8}>{item.size}</Col>
                                               <Col span={8}>
                                                   {item.fileFrom}
                                               </Col>
                                               <Col span={8}>
                                                   {formatDate.dealMessageTime(item.createdAt)}
                                               </Col>
                                           </Row>
                                       </Col>
                                       <Col span={8} style={{ textAlign: 'center' }}>
                                           <a href={item.url} download={item.name} >
                                               <Icon icon="icon-xiazai icon-twoli" size={20} />
                                           </a>
                                           <Icon
                                               icon="icon-guanbi icon-twoli"
                                               size={20}
                                               onClick={() => this.handleRList(item._id)}
                                           />
                                       </Col>
                                   </Row>
                               </li>)
                           ;
                       },
                       )}
                   </ul>
               </div>
           </div>
       );
   }
}

export default withTracker((Id) => {
    Meteor.subscribe('files');
    Meteor.subscribe('projectfile');
    // const filess = ProjectFile.find({ projectId: Id.pId }).fetch().map(msg => msg.from);
    const file = ProjectFile.find({ projectId: Id.pId }).fetch();
    const files = [];
    file.map((item) => {
        files.push(item.fileId);
        return files;
    });
    const projectfile = File.find({ _id: { $in: files } }).fetch();
    if (projectfile[0]) {
        projectfile.forEach((d) => {
            d.fileFrom = PopulateUtil.user(d.from).profile.name;
        });
    }

    return {
        projectfile,
    };
})(projectTask);
