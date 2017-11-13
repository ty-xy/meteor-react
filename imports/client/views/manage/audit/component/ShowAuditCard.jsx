import React from 'react';
// import PropTypes from 'prop-types';
import MyModel from './MyModel';

const ShowAuditCard = props => (
    <MyModel {...props}>
        <div>body</div>
    </MyModel>
);

export default ShowAuditCard;
