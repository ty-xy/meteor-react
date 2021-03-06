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
import UserUtil from '../../../../../util/user';

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
                const peo = caches[0].peo.map(item => (item.userId));
                this.setState({ ...this.state, ...caches[0], peo, firstCache: true });
            }
        }
    }
    formSubmit = (e) => {
        e.preventDefault();
        const { form, companyInfo } = this.props;
        const { deps = [] } = companyInfo || {};
        const { img, file, group, peo, logType } = this.state;
        form.validateFields((err, fields) => {
            if (err) {
                return false;
            }
            if (peo.length === 0 && group.length === 0) {
                feedback.dealWarning('发送群组和对象至少选其一');
                return false;
            }
            let peos = peo;
            if (group && group.length) {
                group.forEach((depId) => {
                    for (let i = 0; i < deps.length; i++) {
                        if (depId === deps[i].id) {
                            peos = peos.concat(deps[i].members);
                            break;
                        }
                    }
                    if (depId === companyInfo._id) {
                        const companyMember = companyInfo.members.map(item => (item.userId));
                        peos = peos.concat(companyMember);
                    }
                });
            }
            const peoRes = [];
            peos.forEach((item) => {
                if (peoRes.indexOf(item) === -1) {
                    peoRes.push(item);
                }
            });
            const toMembers = peos.map(userId => ({ userId }));
            console.log('peo', fields, peo, peos);
            // 创建日志
            this.tabSubmit({ ...fields, peo: peos, type: logType, img, file, group, toMembers });
        });
    }
    // 写日志
    tabSubmit = (fields) => {
        const { plan, finish, help } = this.state;
        const _this = this;
        fields.userId = Meteor.userId();
        fields.nickname = UserUtil.getName();
        fields.company = UserUtil.getMainCompany();
        fields.cache = false;
        fields.help = help;
        fields.plan = plan;
        fields.finish = finish;
        const { state = {} } = this.props.location;
        const { firstCache } = this.state;
        if (state.edit || state.handleTab || firstCache) {
            fields._id = this.state._id;
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
                        feedback.successToastFb('发布成功', () => {
                            _this.setState({ cache: false });
                            _this.props.history.push({ pathname: '/manage/logging/outbox' });
                        });
                    }
                },
            );
        }
    }
    // 图片id返回
    changeUpdate = (name, imgs) => {
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
        const content = (e.target.value || '').replace(/\n/g, '<br/>');
        this.setState({ [keyword]: content });
        // this.handleblur();
    }
    handleblur = () => {
        const { finish, plan, help, img, file, peo, group, logType, _id, firstCache } = this.state;
        // console.log('handleblur', finish, plan, help, img, file, peo, group, logType, _id, firstCache);
        const userId = Meteor.userId();
        const nickname = UserUtil.getName();
        const company = UserUtil.getMainCompany();
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
        console.log('peo', peo);
        return (
            <Form onSubmit={this.formSubmit} id="formDiv" className="e-mg-log-write-form" ref={i => this.$formDiv = i}>
                <InputArea defaultValue={(finish || '').replace(/<br\/>/g, '\r\n')} title={textShow === '日' ? '今日工作总结' : `本${textShow}工作总结`} keyword="finish" required requiredErr="工作总结必填" onChange={this.handlechange} {...this.props} />
                <InputArea defaultValue={(plan || '').replace(/<br\/>/g, '\r\n')} title={textShow === '日' ? '明日工作计划' : `下${textShow}工作计划`} keyword="plan" required requiredErr="工作计划必填" onChange={this.handlechange} {...this.props} />
                <InputArea defaultValue={(help || '').replace(/<br\/>/g, '\r\n')} title="需要协调与帮助：" keyword="help" onChange={this.handlechange} {...this.props} />
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
    return {
        companyInfo: Company.findOne({ _id: UserUtil.getMainCompany() }),
        companys: Company.find().fetch(),
        allUsers: Meteor.users.find().fetch(),
        cachelog: Log.find({ userId: Meteor.userId(), company: UserUtil.getMainCompany(), type: '日报', cache: true }).fetch(),
    };
})(Form.create()(Day));
