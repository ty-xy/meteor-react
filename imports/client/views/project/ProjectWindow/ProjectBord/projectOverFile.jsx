import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Card } from 'antd';
import Icon from '../../../../components/Icon';
@pureRender
export default class projectOverFile extends Component {
    render() {
        return (
            <div style={{ height: '690px' }}>
                <Card title="已建档项目" style={{ height: '100%', textAlign: 'center', position: 'relative' }}>
                    <div className="e-p-o-right">
                        <p>你还没有已归档项目</p>
                        <Icon icon="icon-meiyouxiaoshoudongtai icon" />
                    </div>
                </Card>
            </div>
        );
    }
}
