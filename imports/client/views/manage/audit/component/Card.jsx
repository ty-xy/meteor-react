import React from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import format from 'date-format';
import { userIdToInfo } from '../../../../../util/user';


const CardAudit = ({ handlerAudit, type, reason, daynum, createdAt, status, userId, _id, allUsers, details, total, content, detail }) => (
    <Col className="e-mg-log-card">
        <div className="e-mg-log-card-header">
            <Col span={16}>
                <img src={userIdToInfo.getAvatar(allUsers, userId) || 'http://k2.jsqq.net/uploads/allimg/1706/7_170629152344_5.jpg'} width="56px" alt="" />
                <span className="e-mg-log-card-header-left">{userIdToInfo.getName(allUsers, userId)}</span>
            </Col>
            <Col span={8} className="e-mg-log-card-header-right">{type}</Col>
        </div>
        <div className="e-mg-log-card-body e-mg-audit-card-yes">
            {
                status === '同意' && (<img src="/audit_yes.png" />)
            }
            {
                status === '拒绝' && (<img src="/audit_no.png" />)
            }
            {
                /假/g.test(type) && (<div>
                    <p><span>请假事由：</span>{reason}</p>
                    <p><span>请假类型：</span>{type}</p>
                    <p><span>请假天数：</span>{daynum}</p>
                </div>)
            }
            {
                type === '调休' && (<div>
                    <p><span>请假事由：</span>{reason}</p>
                    <p><span>请假类型：</span>{type}</p>
                    <p><span>请假天数：</span>{daynum}</p>
                </div>)
            }
            {
                type === '出差' && (<div>
                    <p><span>出差地点：</span>{details.map((item, index) => (<span key={index}>{item.location},</span>))}</p>
                    <p><span>开始时间：</span>{details[0].startAt}</p>
                    <p><span>结束时间：</span>{details[details.length - 1].endAt}</p>
                </div>)
            }
            {
                type === '报销' && (<div>
                    <p><span>报销类别：</span>{details.map((item, index) => (<span key={index}>{item.category},</span>))}</p>
                    <p><span>费用明细：</span>{details.map((item, index) => (<span key={index}>{item.reason},</span>))}</p>
                    <p><span>总报销金额(元)：</span>{total}</p>
                </div>)
            }
            {
                type === '通用审批' && (<div>
                    <p><span>申请时间：</span>{format('yyyy-MM-dd', createdAt)}</p>
                    <p><span>申请内容：</span>{content}</p>
                    <p><span>申请详情：</span>{detail}</p>
                </div>)
            }

        </div>
        <div className="e-mg-log-card-footer">
            <Col span={12}>{format('MM月dd日', createdAt)}</Col>
            <Col span={12} className="right">
                <a onClick={e => handlerAudit(e, _id)} href="">
                    {
                        status === '待审核' ? (<span style={{ color: '#FFA200' }}>审批中</span>)
                            : status === '拒绝' ? (<span style={{ color: '#ef5350' }}>已{status}</span>)
                                : status === '同意' ? (<span style={{ color: '#15B4F1' }}>已{status}</span>)
                                    : null

                    }
                </a>
            </Col>
        </div>
    </Col>
);

CardAudit.propTypes = {
    handlerAudit: PropTypes.func,
    _id: PropTypes.string,
    userId: PropTypes.string,
    reason: PropTypes.string,
    type: PropTypes.string,
    daynum: PropTypes.number,
    createdAt: PropTypes.object,
    status: PropTypes.string,
    allUsers: PropTypes.array,
    details: PropTypes.array,
    total: PropTypes.number,
    content: PropTypes.string,
    detail: PropTypes.string,
};

export default CardAudit;
