import React from 'react';
import { Button } from 'antd';
import InputArea from '../../component/InputArea';
import ImgUpload from '../../component/ImgUpload';


const Week = props => (
    <div style={{ height: '100%' }}>
        <InputArea title="今日工作总结：" keyword="dayFinish" {...props} />
        <InputArea title="明日工作计划：" keyword="dayPlan" {...props} />
        <InputArea title="需要协调与帮助：" keyword="dayHelp" marginBottom="20px" {...props} />
        <ImgUpload title="添加图片：（支持.jpg, .jpeg, .bmp, .gif, .png类型文件， 5M以内）" keyword="dayImg" {...props} />
        <ImgUpload title="添加附件：（支持.doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .rar类型文件， 5M以内）" keyword="dayImg" {...props} />
        <Button htmlType="submit">提交</Button>
    </div>
);
export default Week;
