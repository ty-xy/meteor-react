import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

import BaikeLeftSide from './BaikeLeftSide';
import BaikeWindow from './router';


@pureRender
class Baike extends Component {
    render() {
        return (
            <div className="ejianlian-baike-body">
                <BaikeLeftSide {...this.props} />
                <BaikeWindow {...this.props} />
            </div>
        );
    }
}

export default Baike;
