import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

class MyModel extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { show: false };
    }
    render() {
        const { title = 'title头部', footer, handleCancel, show } = this.props;
        const classname = show ? 'e-mg-model e-mg-model-show' : 'e-mg-model';
        console.log('MyModel', this.props);
        return (
            <div className={classname}>
                <div className="e-mg-model-header">
                    <div className="e-mg-model-header-title">
                        {title}
                        <span className="e-mg-model-header-close" onClick={handleCancel}>关闭</span>
                    </div>
                </div>
                <div className="e-mg-model-body">{this.props.children}</div>
                {
                    !footer ? <div className="e-mg-model-footer">
                        <div className="text-center">
                            <Button type="primary">确定</Button>
                            <Button className="margin-left-20" onClick={handleCancel}>取消</Button>
                        </div>
                    </div> : null
                }
            </div>
        );
    }
}
MyModel.propTypes = {
    children: PropTypes.element.isRequired,
    title: PropTypes.element.isRequired,
    footer: PropTypes.element,
    handleCancel: PropTypes.func,
    show: PropTypes.bool,
};

export default MyModel;
