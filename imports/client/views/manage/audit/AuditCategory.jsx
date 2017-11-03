import React from 'react';
import { Link } from 'react-router-dom';
import MyIcon from '../../../components/Icon';


const categorys = [
    { name: '请假', icon: 'icon-qingjia', url: '/manage/audit/leave' },
    { name: '出差', icon: 'icon-chucha1', url: '/manage/audit/business' },
    { name: '报销', icon: 'icon-baoxiao1', url: '/manage/audit/bill' },
    { name: '通用审批', icon: 'icon-tongyongshenpi1', url: '/manage/audit/common' },
    { name: '部门协作', icon: 'icon-xiezuo1', url: '/manage/audit/qinjia' },
    { name: '采购申请', icon: 'icon-caigou1', url: '/manage/audit/qinjia' },
    { name: '工作请示', icon: 'icon-qingshi', url: '/manage/audit/qinjia' },
    { name: '添加模板', icon: 'icon-tianjia2', url: '/manage/audit/qinjia' },
];

export default () => (
    <div className="e-mg-audit-send">
        {
            categorys.map(item => (
                <div key={item.icon} className="e-mg-audit-send-card">
                    <Link className="e-mg-audit-send-card-link" to={item.url}>
                        <MyIcon icon={item.icon} size={50} />
                        <p className="font18">{item.name}</p>
                    </Link>
                </div>
            ))
        }
    </div>
);
