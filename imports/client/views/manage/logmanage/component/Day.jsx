import React from 'react';
import { Button, Form } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Log from '../../../../../schema/log';
import Company from '../../../../../schema//company';
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
    componentWillReceiveProps(nextProps) {
        const { pathname, state = {} } = nextProps.location;
        if (pathname === '/manage/logging' && !state.edit) {
            const caches = nextProps.cachelog;
            if (caches.length) {
                this.setState({ ...this.state, ...caches[0], firstCache: true });
            }
        }
    }
    formSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props;
        const { img, file, group, peo, logType } = this.state;
        form.validateFields((err, fields) => {
            if (err) {
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
        const { state = {} } = this.props.location;
        const { firstCache } = this.state;
        if (state.edit || state.handleTab || firstCache) {
            fields._id = this.state._id;
            fields.cache = false;
            Meteor.call(
                'updateLog',
                { ...fields },
                (_err) => {
                    if (_err) {
                        feedback.dealError(_err);
                    } else {
                        feedback.successToastFb('更新成功', () => { _this.setState({ cache: false }); _this.props.history.push({ pathname: '/manage/logging/outbox' }); });
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
                        feedback.successToastFb('发布成功', () => { _this.setState({ cache: false }); _this.props.history.push({ pathname: '/manage/logging/outbox' }); });
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
            this.setState({ img: imgs }, () => {
                // this.handleblur();
            });
        }
        if (name === 'file') {
            this.setState({ file: imgs }, () => {
                // this.handleblur();
            });
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
        this.setState({ [keyword]: leftUsers, [`visible${keyword}`]: false, requireGroupNotice: false }, () => {
            // this.handleblur();
        });
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
    // handlechange input改变缓存
    handlechange = (e, keyword) => {
        // console.log('handlechange', e.target.value, keyword);
        this.setState({ [keyword]: e.target.value });
        // this.handleblur();
    }
    handleblur = () => {
        const { finish, plan, help, img, file, peo, group, logType, _id, firstCache } = this.state;
        // console.log('handleblur', finish, plan, help, img, file, peo, group, logType, _id, firstCache);
        const userId = Meteor.user()._id;
        const nickname = Meteor.user().profile.name;
        const company = Meteor.user().profile.mainCompany;
        const cache = {
            finish, plan, help, img, file, peo, group,
        };
        let isText = false;
        if (finish || plan || help || img.length || file.length || peo.length || group.length) {
            isText = true;
        }
        const { state = {} } = this.props.location;
        if (firstCache && isText) {
            const res = { ...cache, type: logType, _id, userId, nickname, company, cache: true, ...this.props.form.getFieldsValue() };
            Meteor.call(
                'updateLog',
                { ...res },
                (_err) => {
                    if (_err) {
                        feedback.dealError(_err);
                    } else {
                        // feedback.successToast('缓存成功');
                    }
                },
            );
        }
        if (isText && state.handleTab) {
            const res = { ...cache, type: logType, userId, nickname, company, cache: true, ...this.props.form.getFieldsValue() };
            if (state._id) {
                res._id = _id;
                Meteor.call(
                    'updateLog',
                    { ...res },
                    (_err) => {
                        if (_err) {
                            feedback.dealError(_err);
                        } else {
                            // feedback.successToast('缓存成功');
                        }
                    },
                );
            } else {
                Meteor.call(
                    'createLog',
                    { ...res },
                    (_err) => {
                        if (_err) {
                            feedback.dealError(_err);
                        } else {
                            // feedback.successToast('缓存成功');
                        }
                    },
                );
            }
        } else if (isText && !state.edit && !firstCache && !state.handleTab) {
            const res = { ...cache, type: logType, userId, nickname, company, cache: true, ...this.props.form.getFieldsValue() };
            Meteor.call(
                'createLog',
                { ...res },
                (_err) => {
                    if (_err) {
                        feedback.dealError(_err);
                    } else {
                        // feedback.successToast('缓存成功');
                    }
                },
            );
        }
    }
    render() {
        const { visiblepeo, visiblegroup, textShow, requireGroupNotice, group, img = [], file = [], peo = [], finish, plan, help } = this.state;
        console.log('day', this.props, this.state);
        return (
            <Form onSubmit={this.formSubmit} id="formDiv" ref={i => this.$formDiv = i}>
                <InputArea defaultValue={finish} title={textShow === '日' ? '今日工作总结' : `本${textShow}工作总结`} keyword="finish" required requiredErr="工作总结必填" onChange={this.handlechange} {...this.props} />
                <InputArea defaultValue={plan} title={textShow === '日' ? '明日工作计划' : `下${textShow}工作计划`} keyword="plan" required requiredErr="工作计划必填" onChange={this.handlechange} {...this.props} />
                <InputArea defaultValue={help} title="需要协调与帮助：" keyword="help" marginBottom="20px" onChange={this.handlechange} {...this.props} />
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
    Meteor.subscribe('log');
    const companys = Company.find().fetch();
    const mainCompany = Meteor.user() && Meteor.user().profile.mainCompany;
    let companyInfo = {};
    companys.forEach((item) => {
        if (item._id === mainCompany) {
            companyInfo = item;
        }
    });
    const userId = Meteor.user() && Meteor.user()._id;
    return {
        companyInfo,
        companys,
        allUsers: Meteor.users.find().fetch(),
        cachelog: Log.find({ userId, company: mainCompany, type: '日报', cache: true }).fetch(),
    };
})(Form.create()(Day));
