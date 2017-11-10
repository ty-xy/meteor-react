import React, { Component } from 'react';
import { Form, Col, Row, Avatar, Input } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import format from 'date-format';
import Select from './component/Select';
import MyInput from './component/Input';
import DatePicker from './component/DatePicker';
import Card from './component/Card';
import feedback from '../../../../util//feedback';
// import ImgUpload from '../component/ImgUpload';
// import FileUpload from '../component/FileUpload';
// import feedback from '../../../../util//feedback';
// import Authentication from '../../../components/Authentication';
// import ShowAuditCard from './component/ShowAuditCard';
import MyModel from './component/MyModel';
import Leave from '../../../../../imports/schema/leave';
import CommonAudit from '../../../../../imports/schema/commonAudit';
import Checkbill from '../../../../../imports/schema/checkBill';
import Business from '../../../../../imports/schema/business';
import Company from '../../../../../imports/schema/company';
import UserUtil, { userIdToInfo } from '../../../../util/user';

const { TextArea } = Input;
const types = ['事假', '病假', '年假', '调休', '婚假', '产假', '陪产假', '路途假', '其他', '出差', '报销', '通用审批'];
let searchFilter = false;
const filterCodition = {
    type: '',
    keyword: '',
    datepicker: '',
};

class MyAudit extends Component {
    static propTypes = {
        location: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
            img: [],
            file: [],
            showAuditCard: false,
            commentModel: false,
            modelData: {},
            cards: [],
        };
    }
    componentWillMount() {
        this.setState({ cards: this.concatAll(this.props) });
    }
    componentWillReceiveProps(nextProps) {
        if (!searchFilter) {
            this.setState({ cards: this.concatAll(nextProps) });
        }
    }
    componentWillUnmount() {
        searchFilter = false;
    }
    // 合并所有的审批类型
    concatAll = ({ leaves, business, commonAudit, checkbill }) => {
        const localUserId = Meteor.user() && Meteor.user()._id;
        let cards = [];
        cards = cards.concat(leaves, business, commonAudit, checkbill);
        const res = [];
        cards.forEach((item) => {
            if (item.company === UserUtil.getCompany() && (item.userId === localUserId)) {
                res.push(item);
            }
        });
        return res;
    }
    // 搜索函数
    filterChange = (date, dateString) => {
        searchFilter = true;
        if (dateString && date.length > 0) {
            dateString[0] = date[0];
            dateString[1] = date[1];
            filterCodition.datepicker = dateString;
        }
        if (dateString && date.length === 0) {
            filterCodition.datepicker = '';
        }

        if (Object.prototype.toString.call(date) === '[object Object]') {
            filterCodition.keyword = date.target.value;
        }
        if (typeof date === 'string' || (typeof date === 'undefined')) {
            filterCodition.type = date;
        }
        this.filterCardList(filterCodition);
    }
    // 时间整天毫米获取
    daySecond = (date) => {
        const _formatdate = format('yyyy-MM-dd', date);
        const _date = new Date(Date.parse(_formatdate.replace(/-/g, '/')));
        return _date.getTime() / 1000;
    }
    // 搜索过滤函数
    filterCardList = (res) => {
        const { type, keyword, datepicker } = res;
        const cards = this.concatAll(this.props);
        let newCards = cards;
        if (type || (datepicker && datepicker.length) || keyword) {
            if (type) {
                newCards = newCards.filter(item => (item.type === type));
            }
            if ((datepicker && datepicker.length)) {
                newCards = newCards.filter((item) => {
                    if ((this.daySecond(item.createdAt) <= this.daySecond(datepicker[1]._d)) && (this.daySecond(item.createdAt) >= this.daySecond(datepicker[0]._d))) {
                        return item;
                    }
                    return false;
                });
            }
            if (keyword) {
                const reg = new RegExp(keyword, 'g');
                newCards = newCards.filter((item) => {
                    if (reg.test(item.reason) || reg.test(userIdToInfo.getName(this.props.allUsers, item.userId))) {
                        return item;
                    }
                    return false;
                });
            }

            this.setState({ cards: newCards });
        } else {
            this.setState({ cards });
        }
    }
    // 审核选中的card
    handlerAudit = (e, id) => {
        if (e) {
            e.preventDefault();
        }
        const modelData = this.state.cards.filter(item => (id === item._id))[0];
        this.setState({ showAuditCard: true, modelData });
    }
    // 关闭model按钮
    handleCancel = () => {
        this.setState({ showAuditCard: false });
    }
    // 评论弹框
    handleComment = (e, auditIdea) => {
        e.preventDefault();
        this.setState({ commentModel: true, auditIdea });
    }
    commentModelCancel = () => {
        this.setState({ commentModel: false, auditComment: '' });
    }
    // 评论内容
    handleAuditIdea = (e) => {
        this.setState({ auditComment: e.target.value });
    }
    // 品论提交
    handleCommentbtn = () => {
        const { modelData, auditComment, auditIdea } = this.state;
        const _this = this;
        const res = {
            content: auditComment,
            userId: Meteor.user()._id,
            _id: modelData._id,
            type: modelData.type,
            isAudit: auditIdea,
        };
        console.log('res', res);
        Meteor.call(
            'updateAudit',
            { ...res },
            (err) => {
                if (err) {
                    feedback.dealError(err.reason);
                } else {
                    feedback.successToast(`${auditIdea}成功`);
                    _this.setState({ commentModel: false, auditComment: '', showAuditCard: false });
                    // setTimeout(() => {
                    //     _this.handlerAudit(null, modelData._id);
                    // }, 1000);
                }
            },
        );
    }
    render() {
        const { showAuditCard, cards, modelData, commentModel, auditIdea, auditComment } = this.state;
        const footer = () => {
            if (modelData.status === '待审核') {
                const length = (modelData.comments || []).length - 1;
                if (length >= 0 && modelData.comments[length].isAudit === '待审核' && modelData.comments[length].userId === modelData.userId) {
                    return (
                        <div className="e-mg-model-footer clearfix" key={23}>
                            <Col span={6} className="text-center"><a href="" onClick={e => this.handleComment(e, '同意')}>同意</a><span className="pull-right">|</span></Col>
                            <Col span={6} className="text-center"><a href="" onClick={e => this.handleComment(e, '拒绝')}>拒绝</a><span className="pull-right">|</span></Col>
                            <Col span={6} className="text-center"><a href="" onClick={e => this.handleComment(e, '转交')}>转交</a><span className="pull-right">|</span></Col>
                            <Col span={6} className="text-center"><a href="" onClick={e => this.handleComment(e, '评论')}>评论</a></Col>
                        </div>
                    );
                }
                return (
                    <div className="e-mg-model-footer clearfix" key={23}>
                        <Col span={24} className="text-center" style={{ color: '#15B4F1' }}>{modelData.status}</Col>
                    </div>
                );
            }
            return (
                <div className="e-mg-model-footer clearfix" key={23}>
                    <Col span={24} className="text-center" style={{ color: '#15B4F1' }}>已{modelData.status}</Col>
                </div>
            );
        };
        const allCards = cards;
        const { allUsers, users } = this.props;
        console.log('approval', this.props, this.state);

        return (
            <div>
                <Form className="margin-top-20 border-bottom-eee clearfix">
                    <Col span={7}><Select keyword="type" label="审批类型" onChange={this.filterChange} placeholder="请选择审批类型" width="150" {...this.props} data={types} /></Col>
                    <Col span={7}><MyInput keyword="keyword" label="关键词" onChange={this.filterChange} placeholder="请输入关键词" width="150" {...this.props} /></Col>
                    <Col span={7}><DatePicker keyword="datepicker" label="查询日期" onChange={this.filterChange} placeholder={['开始时间', '结束时间']} width="300" {...this.props} /></Col>
                </Form>
                <Row className="e-mg-log-filter margin-top-20" gutter={25} type="flex" justify="start">
                    {allCards.map(item => (<Card handlerAudit={this.handlerAudit} key={item._id} {...item} {...this.props} />))}
                    {
                        allCards.length === 0 && <Col className="e-mg-text-center" span={23}>暂无审批。</Col>
                    }
                </Row>
                <MyModel
                    handleCancel={this.handleCancel}
                    show={showAuditCard}
                    footer={footer()}
                    title={`${userIdToInfo.getName(allUsers, modelData.userId)}的${modelData.type}审批`}
                    mask={showAuditCard}
                >
                    <div>
                        <div className="border-bottom-eee e-mg-model-body-avatar clearfix">
                            <Col className="text-right" span={3}>
                                <Avatar src={userIdToInfo.getAvatar(allUsers, modelData.userId) || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'} />
                            </Col>
                            <Col span={18} className="margin-left-10" style={{ marginTop: '7px' }}>
                                <p>{userIdToInfo.getName(allUsers, modelData.userId)}</p>
                                <p className="" style={{ color: 'rgb(255, 162, 0)' }}>{modelData.status}</p>
                            </Col>
                        </div>
                        <div className="e-mg-model-body-content">
                            <p>
                                <span className="e-mg-body-content-span">所属部门：</span>
                                <span className="margin-right-20">{userIdToInfo.getDep(users, modelData.userId)}</span>
                            </p>
                            <p><span className="e-mg-body-content-span">请假类型：</span>{modelData.type}</p>
                            <p><span className="e-mg-body-content-span">请假天数：</span>{modelData.daynum}</p>
                            <p><span className="e-mg-body-content-span">开始时间：</span>{format('yyyy-MM-dd', modelData.startAt)}</p>
                            <p><span className="e-mg-body-content-span">结束时间：</span>{format('yyyy-MM-dd', modelData.endAt)}</p>
                            <p><span className="e-mg-body-content-span">请假事由：</span></p>
                            <p>{modelData.reason}</p>
                            <p><span className="e-mg-body-content-span">图片：</span></p>
                            <p>{
                                (modelData.img && modelData.img.length) ?
                                    modelData.img.map(item => (<a key={item} href={`http://oxldjnom8.bkt.clouddn.com/${item}`} download><img style={{ width: '32px' }} src={`http://oxldjnom8.bkt.clouddn.com/${item}`} /></a>))
                                    : '暂无图片'
                            }</p>
                            <p><span className="e-mg-body-content-span">附件：</span></p>
                            <p>{
                                (modelData.file && modelData.file.length) ?
                                    modelData.file.map(item => (<a key={item} href={`http://oxldjnom8.bkt.clouddn.com/${item}`} download><img style={{ width: '32px' }} src={`http://oxldjnom8.bkt.clouddn.com/${item}`} /></a>))
                                    : '暂无附件'
                            }</p>
                        </div>
                        <div className="e-mg-model-body-comment clearfix">
                            <div className="clearfix">
                                <Col className="" span={10}><Avatar src={userIdToInfo.getAvatar(allUsers, modelData.userId) || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'} /><span>  {userIdToInfo.getName(allUsers, modelData.userId)} 发起的申请</span></Col>
                                <Col className="text-right" span={14}>{format('yyyy-MM-dd hh:dd:ss', modelData.createAt)}</Col>
                            </div>
                            {
                                (modelData.comments || []).map((item, index) => (
                                    <div className="clearfix" key={index}>
                                        <Col className="" span={10}><Avatar src={userIdToInfo.getAvatar(allUsers, item.userId) || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'} /><span>  {userIdToInfo.getName(allUsers, item.userId)} {item.isAudit || '进行了评论'}</span></Col>
                                        <Col className="text-right" span={14}>{format('yyyy-MM-dd hh:mm:ss', item.careateAt)}</Col>
                                        <p style={{ lineHeight: 1.4, marginLeft: '35px' }}>{item.content}</p>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </MyModel>
                <MyModel
                    handleCancel={this.commentModelCancel}
                    show={commentModel}
                    title="钱江艳的请假审批"
                    animation="vertical"
                    mask={commentModel}
                    handleCommentbtn={this.handleCommentbtn}
                >
                    <div className="clearfix e-mg-model-comment">
                        <Col span={24} className="">审批意见：{auditIdea}</Col>
                        <Col span={24}>意见说明：</Col>
                        <Col span={24}>
                            <TextArea value={auditComment} placeholder="请输入审批意见或者评论" rows={4} onChange={this.handleAuditIdea} />
                        </Col>
                    </div>
                </MyModel>
            </div>
        );
    }
}

MyAudit.propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
    leaves: PropTypes.array,
    allUsers: PropTypes.array,
    users: PropTypes.array,
};

export default withTracker(() => {
    Meteor.subscribe('leave');
    Meteor.subscribe('business');
    Meteor.subscribe('checkbill');
    Meteor.subscribe('commonaudit');
    Meteor.subscribe('company');
    Meteor.subscribe('users');
    const companys = Company.find().fetch();
    let users = [];
    const mainCompany = UserUtil.getCompany();
    companys.forEach((item) => {
        if (item._id === mainCompany) {
            users = item.members;
        }
    });
    return {
        allUsers: Meteor.users.find().fetch() || [],
        leaves: Leave.find().fetch(),
        checkbill: Checkbill.find().fetch(),
        business: Business.find().fetch(),
        commonAudit: CommonAudit.find().fetch(),
        companys,
        users,
    };
})(Form.create()(MyAudit));
