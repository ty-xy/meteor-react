import React from 'react';
import PropTypes from 'prop-types';


const RightHeader = ({ name, handleSetting }) => (
    <div className="text-center right-header clearfix">
        <p>{name}</p>
        <i className="iconfont icon-shezhi" onClick={handleSetting} />
    </div>
);
RightHeader.propTypes = {
    name: PropTypes.string,
    handleSetting: PropTypes.func,
};
export default RightHeader;
