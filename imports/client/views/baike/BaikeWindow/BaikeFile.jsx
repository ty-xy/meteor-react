import React, { Component } from 'react';
import { Input } from 'antd';
import pureRender from 'pure-render-decorator';

import Icon from '../../../components/Icon';

const Search = Input.Search;
@pureRender
class BaikeFirst extends Component {
    render() {
        return (
            <div className="ejianlian-baike-window ">
                <div className="ejianlian-people-window  ejian-wenku-window" >
                    <div className="ejian-people-window-title ejian-wenku-title">
                        <div className="ejian-people-window-title-left">
                            <Icon
                                icon="icon-wenjian"
                                iconColor="#29B6F6"
                                size={40}
                            />
                            <p>知工文库</p>
                        </div>
                        <Search
                            placeholder="请输入关键词..."
                            size="large"
                            onSearch={value => console.log(value)}
                            style={{ width: 300, height: 50 }}
                            className="baike-search"
                        />
                    </div>
                    <div className="baike-zhigong-wenku-body">
                        <img src="/sheet.png" />
                        <img src="/engdrawings.png" />
                        <img src="/normal.png" />
                        <img src="/software.png" />
                        <img src="/document.png" />
                        <img src="/construct.png" />
                        <img src="/gallery.png" />
                        <img src="/other.png" />
                    </div>
                </div>
            </div>
        );
    }
}

export default BaikeFirst;
