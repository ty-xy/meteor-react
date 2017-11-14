import React from 'react';
import { Button, Form } from 'antd';
import PropTypes from 'prop-types';
import InputArea from '../../component/InputArea';
import ImgUpload from '../../component/ImgUpload';
import FileUpload from '../../component/FileUpload';
import GroupSelect from '../../audit/component/GroupSelect';
import feedback from '../../../../../util/feedback';


class Day extends (React.PureComponent || React.Component) {
    constructor(props) {
        super(props);
        this.state = {
            file: [],
            img: [],
            groupRequire: true, // 选择审核对象是否必填
            requiregroupNotice: false, // 必填项错误信息是否提示
            peoRequire: true, // 选择审核对象是否必填
            requirepeoNotice: false, // 必填项错误信息是否提示
            peo: [], // 选择的审核对象
            group: [],
        };
    }
    componentWillMount() {
        console.log('editInfo', this.props.editInfo);
        const { img, file } = this.props.editInfo;
        if (img) {
            this.setState({ img });
        }
        if (file) {
            this.setState({ file });
        }
        // const { editInfo } = this.props;
        // const { peo = [], group = [] } = editInfo;
        // const res = {
        //     peo: [],
        //     group: [],
        // };
        // if (peo.length) {
        //     res.peo = res;
        // }
        // if (group.length) {
        //     res.group = group;
        // }
        // this.setState({ ...res });
    }
    formSubmit = (e) => {
        e.preventDefault();
        const { form, tab1Submit, logType } = this.props;
        const { img, file, group, groupRequire, peo, peoRequire } = this.state;
        form.validateFields((err, fields) => {
            if (err) {
                feedback.dealWarning('工作总结和工作计划必填');
                return false;
            }
            if (peoRequire) {
                if (peo.length === 0) {
                    this.setState({ requirepeoNotice: true });
                    return false;
                }
            }
            if (groupRequire) {
                if (group.length === 0) {
                    this.setState({ requiregroupNotice: true });
                    return false;
                }
            }
            fields.type = logType;
            fields.file = file;
            fields.img = img;
            fields.peo = peo;
            fields.group = group;
            tab1Submit(fields);
        });
    }
    // 图片id返回
    changeUpdate = (name, imgs) => {
        // const img = [];
        // const file = [];
        console.log('changeUpdate', name, imgs);
        // const { img, file } = this.state;
        if (name === 'img') {
            this.setState({ img: imgs });
        }
        if (name === 'file') {
            this.setState({ file: imgs });
        }
    }
    // 删除图片
    removeUpload = (imgs, keyword) => {
        this.setState({ [keyword]: imgs });
    }
    // 获取添加的人员
    getGroup = (keyword, data) => {
        this.setState({ [keyword]: data, [`require${keyword}Notice`]: false });
    }
    render() {
        const { editInfo } = this.props;
        const { peo, group } = editInfo;
        const { requirepeoNotice, requiregroupNotice, img = [], file = [] } = this.state;
        console.log('img-file', this.state);
        return (
            <Form onSubmit={this.formSubmit} style={{ height: '100%' }}>
                <InputArea title="今日工作总结：" keyword="finish" required {...this.props} />
                <InputArea title="明日工作计划：" keyword="plan" required {...this.props} />
                <InputArea title="需要协调与帮助：" keyword="help" marginBottom="20px" {...this.props} />
                <ImgUpload title="添加图片：（支持.jpg, .jpeg, .bmp, .gif, .png类型文件， 5M以内）" keyword="img" fileList={img || []} changeUpdate={this.changeUpdate} removeUpload={this.removeUpload} {...this.props} />
                <FileUpload title="添加附件：（支持.doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .rar类型文件， 5M以内）" keyword="file" fileList={file || []} removeUpload={this.removeUpload} changeUpdate={this.changeUpdate} {...this.props} />
                <GroupSelect
                    keyword="peo"
                    label="发送至人员"
                    isSelected={false}
                    isSelectedTrueTitle="(点击头像可删除)"
                    selectedValue={peo}
                    required={requirepeoNotice}
                    requiredErr="发送对象必选"
                    getGroup={this.getGroup}
                    modelTitle="选人"
                    offset={0}
                    iconTitle="添加"
                />
                <div className="margin-top-10" />
                <GroupSelect
                    keyword="group"
                    label="发送至部门"
                    isSelected={false}
                    isSelectedTrueTitle="(点击头像可删除)"
                    selectedValue={group}
                    required={requiregroupNotice}
                    requiredErr="请选择发送部门"
                    getGroup={this.getGroup}
                    modelTitle="选部门"
                    isSelecteGroup
                    offset={0}
                    iconTitle="添加"
                />
                <Button htmlType="submit" type="primary">提交</Button>
                <Button className="margin-left-10">取消</Button>
            </Form>
        );
    }
}
Day.propTypes = {
    tab1Submit: PropTypes.func,
    form: PropTypes.object,
    logType: PropTypes.string,
};
export default Form.create()(Day);
