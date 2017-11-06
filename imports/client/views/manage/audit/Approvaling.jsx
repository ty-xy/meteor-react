import React, { Component } from 'react';
import { Form, Col, Row } from 'antd';
import PropTypes from 'prop-types';
// import { Meteor } from 'meteor/meteor';
import format from 'date-format';
import Select from './component/Select';
import Input from './component/Input';
import DatePicker from './component/DatePicker';
import Card from './component/Card';
// import ImgUpload from '../component/ImgUpload';
// import FileUpload from '../component/FileUpload';
// import feedback from '../../../../util//feedback';


const types = ['事假', '病假', '年假', '调休', '婚假', '产假', '陪产假', '路途假', '其他'];

class Approvaling extends Component {
    static propTypes = {
        location: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
            img: [],
            file: [],
            groupRequire: true, // 选择审核对象是否必填
            requireGroupNotice: false, // 必填项错误信息是否提示
            approvers: [], // 选择的审核对象
            copy: [],
        };
    }
    filterChange = (date, dateString) => {
        const res = this.props.form.getFieldsValue();
        console.log('date', date, dateString);
        if (dateString && date.length) {
            dateString[0] = date[0].unix();
            dateString[1] = date[1].unix();
            res.datepicker = dateString;
        } else {
            res.datepicker = undefined;
        }
        if (Object.prototype.toString.call(date) === '[object Object]') {
            res.keyword = date.target.value;
        }
        if (typeof date === 'string' || (typeof date === 'undefined')) {
            res.type = date;
        }
        console.log('res', res, format('yyyy-MM-dd', new Date()));
    }
    render() {
        const cards = [
            {
                name: '倩倩',
                avatar: '',
                type: '请假',
                reason: '理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由理由',
                num: '12',
                date: '07年31日',
                status: '待审核',
                _id: 'ahdjk78hjs',
            },
            {
                name: '倩倩',
                avatar: '',
                type: '请假',
                reason: '理由理由',
                num: '12',
                date: '07年31日',
                status: '待审核',
                _id: 'ahdjk78h5453js',
            },
            {
                name: '倩倩',
                avatar: '',
                type: '请假',
                reason: '理由理由',
                num: '12',
                date: '07年31日',
                status: '待审核',
                _id: 'ahdjk722348hjs',
            },
            {
                name: '倩倩',
                avatar: '',
                type: '请假',
                reason: '理由理由',
                num: '12',
                date: '07年31日',
                status: '待审核',
                _id: 'ahdjk7854hjs',
            },
        ];
        return (
            <div>
                <Form className="margin-top-20 border-bottom-eee clearfix">
                    <Col span={6}><Select keyword="type" label="审批类型" onChange={this.filterChange} placeholder="请选择审批类型" width="150" {...this.props} data={types} /></Col>
                    <Col span={6}><Input keyword="keyword" label="关键词" onChange={this.filterChange} placeholder="请输入关键词" width="150" {...this.props} /></Col>
                    <Col span={6}><DatePicker keyword="datepicker" label="查询日期" onChange={this.filterChange} placeholder={['开始时间', '结束时间']} width="300" {...this.props} /></Col>
                </Form>
                <Row className="e-mg-log-filter margin-top-20" gutter={25} type="flex" justify="start">
                    {cards.map(item => (<Card handlerAudit={() => {}} key={item._id} {...item} />))}
                    {
                        cards.length === 0 && <Col className="e-mg-text-center" span={23}>暂无日志。</Col>
                    }
                </Row>
            </div>
        );
    }
}

Approvaling.propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
};

export default Form.create()(Approvaling);
