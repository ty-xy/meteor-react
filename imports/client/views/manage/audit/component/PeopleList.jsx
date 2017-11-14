import React from 'react';
import PropTypes from 'prop-types';
import MyIcon from '../../../../components/Icon';
import { userIdToInfo } from '../../../../../util/user';

const colors = ['#7986CB', '#4DB6AC', '#9575CD', '#F06292'];

const MyInput = ({ iconTitle, componentSelectedUser, isSelecteGroup, keyword, required, requiredErr, companyInfo, allUsers, showModal, handlePeopleChange }) => {
    const getAvatar = (userId) => {
        const avatar = userIdToInfo.getAvatar(allUsers, userId);
        const name = userIdToInfo.getName(allUsers, userId);
        if (avatar) {
            return (<img src={avatar} alt="" />);
        }
        return <span style={{ background: colors[Math.floor(Math.random() * 4)], color: '#FFF' }} className="e-mg-audit-deps-people-per-img e-mg-audit-deps-people-per-span">{(name || '').substr(-2, 3)}</span>;
    };
    // 获取群组avatar
    const getDepAvatar = (data, name) => {
        let avatar = '';
        data.forEach((item) => {
            if (item.name === name) {
                if (item.avatar) {
                    avatar = (<img src={item.avatar} alt="" />);
                } else {
                    avatar = <span style={{ background: colors[Math.floor(Math.random() * 4)], color: '#FFF' }} className="e-mg-audit-deps-people-per-img e-mg-audit-deps-people-per-span">{name}</span>;
                }
            }
        });
        return avatar;
    };
    return (
        <div style={{ position: 'relative' }}>
            {isSelecteGroup ?
                componentSelectedUser.map(item => (
                    <a href="" key={item} onClick={e => handlePeopleChange(e, item, keyword)} className="e-mg-audit-seleted-img">
                        {getDepAvatar(companyInfo.deps || [], item)}
                        <p>{item}</p>
                    </a>
                )) :
                componentSelectedUser.map(item => (
                    <a href="" key={item} onClick={e => handlePeopleChange(e, item, keyword)} className="e-mg-audit-seleted-img">
                        {getAvatar(item)}
                        <p>{userIdToInfo.getName(allUsers, item)}</p>
                    </a>
                ))
            }
            <span className="e-mg-audit-seleted-img">
                <MyIcon icon="icon-tianjia3" size={35} onClick={e => showModal(e, keyword)} />
                <p>{iconTitle}</p>
                {required ?
                    <span
                        style={{ position: 'absolute',
                            top: '12px',
                            left: '60px',
                            color: '#EF5350',
                        }}
                    ><MyIcon icon="icon-cuowu" /> {requiredErr}!</span> : null}
            </span>
        </div>
    );
};
MyInput.propTypes = {
    componentSelectedUser: PropTypes.array,
    allUsers: PropTypes.array,
    showModal: PropTypes.func,
    handlePeopleChange: PropTypes.func,
    companyInfo: PropTypes.object,
    keyword: PropTypes.string,
    requiredErr: PropTypes.string,
    required: PropTypes.bool,
    isSelecteGroup: PropTypes.bool,
    iconTitle: PropTypes.string,
};
export default MyInput;
