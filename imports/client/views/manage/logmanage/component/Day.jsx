import React from 'react';
import { Button, Form } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Company from '../../../../../schema/company';
import InputArea from '../../component/InputArea';
import ImgUpload from '../../component/ImgUpload';
import FileUpload from '../../component/FileUpload';
import ChoosePeopleModel from '../../../../components/ChoosePeopleModel';
import PeopleList from '../../audit/component/PeopleList';
import feedback from '../../../../../util/feedback';

const FormItem = Form.Item;

class Day extends (React.PureComponent || React.Component) {
    constructor(props) {
        super(props);
        this.state = {
            file: [],
            img: [],
            peo: [], // 选择的审核对象
            group: [],
        };
    }
    componentWillMount() {
        const { location } = this.props;
        let logType = '';
        let textShow = '';
        if (location.pathname === '/manage/logging') {
            logType = '日报';
            textShow = '日';
        } else if (location.pathname === '/manage/logging/week') {
            logType = '周报';
            textShow = '周';
        } else if (location.pathname === '/manage/logging/month') {
            logType = '月报';
            textShow = '月';
        }
        const { state = {} } = location;
        this.setState({ logType, textShow, ...state });
    }
    componentDidMount() {
        const { form, location } = this.props;
        if (location.state) {
            const { finish, plan, help } = location.state;
            form.setFieldsValue({ finish, plan, help });
        }
    }
    formSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props;
        const { img, file, group, peo, logType } = this.state;
        form.validateFields((err, fields) => {
            if (err) {
                feedback.dealWarning('工作总结和工作计划必填');
                return false;
            }
            if (peo.length === 0 && group.length === 0) {
                feedback.dealWarning('发送群组和对象至少选其一');
                return false;
            }
            fields.type = logType;
            fields.file = file;
            fields.img = img;
            fields.peo = peo;
            fields.group = group;
            this.tabSubmit(fields);
        });
    }
    // 写日志
    tabSubmit = (fields) => {
        const _this = this;
        fields.userId = Meteor.user()._id;
        fields.nickname = Meteor.user().profile.name;
        fields.company = Meteor.user().profile.mainCompany;
        const { state } = this.props.location;
        if (state) {
            fields._id = state._id;
            Meteor.call(
                'updateLog',
                { ...fields },
                (_err) => {
                    if (_err) {
                        feedback.dealError(_err);
                    } else {
                        feedback.successToastFb('更新成功', () => { _this.props.history.push({ pathname: '/manage/logging/outbox' }); });
                    }
                },
            );
        } else {
            Meteor.call(
                'createLog',
                { ...fields },
                (_err) => {
                    if (_err) {
                        feedback.dealError(_err);
                    } else {
                        feedback.successToastFb('创建成功', () => { _this.props.history.push({ pathname: '/manage/logging/outbox' }); });
                    }
                },
            );
        }
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
    // select people
    showModal = (e, keyword) => {
        e.preventDefault();
        this.setState({
            [`visible${keyword}`]: true,
        });
    }
    // select people cancel
    handleCancel = (e, keyword) => {
        e.preventDefault();
        this.setState({
            [`visible${keyword}`]: false,
            checked: false,
        });
    }
    // 选中的人
    handleOk = (keyword, leftUsers) => {
        this.setState({ [keyword]: leftUsers, [`visible${keyword}`]: false, requireGroupNotice: false });
    }
    // 选中后删除
    handlePeopleChange = (e, id, keyword) => {
        e.preventDefault();
        const res = this.state[keyword];
        const peos = res.filter(item => (item !== id));
        this.setState({ [keyword]: peos });
    }
    goback = () => {
        this.props.history.push({ pathname: '/manage/logging/outbox' });
    }
    render() {
        const { visiblepeo, visiblegroup, textShow, requireGroupNotice, group, img = [], file = [], peo = [] } = this.state;
        console.log('day', this.props);
        return (
            <Form onSubmit={this.formSubmit}>
                <InputArea title={textShow === '日' ? '今日工作总结' : `本${textShow}工作总结`} keyword="finish" required {...this.props} />
                <InputArea title={textShow === '日' ? '明日工作计划' : `下${textShow}工作计划`} keyword="plan" required {...this.props} />
                <InputArea title="需要协调与帮助：" keyword="help" marginBottom="20px" {...this.props} />
                <ImgUpload title="添加图片：（支持.jpg, .jpeg, .bmp, .gif, .png类型文件， 5M以内）" keyword="img" fileList={img || []} changeUpdate={this.changeUpdate} removeUpload={this.removeUpload} {...this.props} />
                <FileUpload title="添加附件：（支持.doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .rar类型文件， 5M以内）" keyword="file" fileList={file || []} removeUpload={this.removeUpload} changeUpdate={this.changeUpdate} {...this.props} />
                <ChoosePeopleModel
                    visible={visiblepeo}
                    cancel={this.handleCancel}
                    ok={this.handleOk}
                    keyword="peo"
                    defaultValue={peo || []}
                    modelTitle="选人"
                >
                    <FormItem
                        label="发送至："
                        className="e-mg-audit-peopleList"
                    >
                        <PeopleList
                            keyword="peo"
                            componentSelectedUser={peo || []}
                            showModal={this.showModal}
                            handleGroupChange={this.handleGroupChange}
                            handlePeopleChange={this.handlePeopleChange}
                            iconTitle="选人"
                            required={requireGroupNotice}
                            {...this.props}
                            {...this.state}
                        />
                    </FormItem>
                </ChoosePeopleModel>
                <ChoosePeopleModel
                    visible={visiblegroup}
                    cancel={this.handleCancel}
                    ok={this.handleOk}
                    keyword="group"
                    defaultValue={group || []}
                    modelTitle="选群组"
                    isSelecteGroup
                >
                    <FormItem
                        label="发送至群组"
                    >
                        <PeopleList
                            keyword="group"
                            iconTitle="选群组"
                            isSelecteGroup
                            componentSelectedUser={group || []}
                            showModal={this.showModal}
                            handleGroupChange={this.handleGroupChange}
                            handlePeopleChange={this.handlePeopleChange}
                            {...this.props}
                            {...this.state}
                        />
                    </FormItem>
                </ChoosePeopleModel>
                <Button htmlType="submit" type="primary">提交</Button>
                <Button className="margin-left-10" onClick={this.goback}>取消</Button>
            </Form>
        );
    }
}
Day.propTypes = {
    tab1Submit: PropTypes.func,
    form: PropTypes.object,
    logType: PropTypes.string,
};

export default withTracker(() => {
    Meteor.subscribe('company');
    Meteor.subscribe('users');
    const companys = Company.find().fetch();
    const mainCompany = Meteor.user() && Meteor.user().profile.mainCompany;
    let companyInfo = {};
    companys.forEach((item) => {
        if (item._id === mainCompany) {
            companyInfo = item;
        }
    });
    return {
        companyInfo,
        companys,
        allUsers: Meteor.users.find().fetch(),
    };
})(Form.create()(Day));
