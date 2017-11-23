import React from 'react';
import PropTypes from 'prop-types';


const RightHeader = ({ name, handleSetting, depActive, editMemberInfo }) => (
    <div className="text-center right-header">
        <p>{name}</p>
        {depActive ? <i className="iconfont icon-shezhi" onClick={() => handleSetting(editMemberInfo)} /> : null}
    </div>
);
RightHeader.propTypes = {
    name: PropTypes.string,
    handleSetting: PropTypes.func,
    editMemberInfo: PropTypes.object,
    depActive: PropTypes.string,
};
export default RightHeader;
