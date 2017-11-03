import React from 'react';
import PropTypes from 'prop-types';
import MyIcon from '../../../../components/Icon';

function goback(e, history) {
    e.preventDefault();
    history.push({ pathname: '/manage/audit' });
}

const Goback = ({ history, title }) => (
    <div className="e-mg-audit-goback">
        <a href="" className="e-mg-audit-send-card-link" onClick={e => goback(e, history)}>
            <MyIcon icon="icon-fanhui1" size={20} /> {title}
        </a>
    </div>
);
Goback.propTypes = {
    history: PropTypes.object,
    title: PropTypes.string,
};
export default Goback;
