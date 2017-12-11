import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const MyModel = ({ title = '请审批', footer, handleCancel, show, animation = '', mask, handleCommentbtn, height, children }) => {
    const classname = show ? `e-mg-model-${animation} e-mg-model-show-${animation}` : `e-mg-model-${animation}`;
    return (
        <div className={`e-mg-model-mask-${mask}`}>
            <div className="e-mg-model-mask" onClick={handleCancel} />
            <div className={classname} style={{ height: height || '350px' }}>
                <div className="e-mg-model-header">
                    <div className="e-mg-model-header-title">
                        {title}
                        <span className="e-mg-model-header-close" onClick={handleCancel}><i className="iconfont icon-chuyidong" /></span>
                    </div>
                </div>
                <div className="e-mg-model-body">{children}</div>
                {
                    !footer ?
                        <div className="e-mg-model-footer">
                            <div className="text-center">
                                <Button className="e-mg-button" onClick={handleCommentbtn}>确定</Button>
                                <Button className="margin-left-20" onClick={handleCancel}>取消</Button>
                            </div>
                        </div>
                        : <div>{footer}</div>
                }
            </div>
        </div>
    );
};
MyModel.propTypes = {
    children: PropTypes.object.isRequired,
    title: PropTypes.string,
    footer: PropTypes.element,
    handleCancel: PropTypes.func,
    show: PropTypes.bool,
    mask: PropTypes.bool,
    animation: PropTypes.string,
    height: PropTypes.string,
    handleCommentbtn: PropTypes.func,
};

export default MyModel;
