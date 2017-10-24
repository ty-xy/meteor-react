import React from 'react';
import { Button } from 'antd';
// import PropTypes from 'prop-types';
import InputArea from '../../component/InputArea';


const Day = props => (
    <div>
        <InputArea title="本周工作总结：" keyword="weekFinish" {...props} />
        <InputArea title="下周工作计划：" keyword="weekPlan" {...props} />
        <InputArea title="需要协调与帮助：" keyword="weekHelp" {...props} />
        <Button htmlType="submit">提交</Button>
    </div>
);
export default Day;
