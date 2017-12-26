import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Input, Pagination } from 'antd';
import { Link } from 'react-router-dom';

import Icon from '../../../components/Icon';

const Search = Input.Search;
@pureRender
class BaikeFirst extends Component {
    onChange=(pageNumber) => {
        console.log('Page: ', pageNumber);
    }
    render() {
        return (
            <div className="ejianlian-baike-window">
                <div className="ejianlian-people-window">
                    <div className="ejian-people-window-title">
                        <div className="ejian-people-window-title-left">
                            <Icon
                                icon="icon-renwu"
                                iconColor="#29B6F6"
                                size={40}
                            />
                            <p>热门人物</p>
                        </div>
                        <Search
                            placeholder="请输入关键词..."
                            size="large"
                            onSearch={value => console.log(value)}
                            style={{ width: 300, height: 50 }}
                            className="baike-search"
                        />
                    </div>
                    <div className="ejian-people-window-body" >
                        <div className="ejian-people-show">
                            <Link to="/baike/detail">
                                <div className="ejian-people-show-reader">
                                    <p>
                                        <img src="http://cdn.zg18.com/donggong.png" />
                                    </p>
                                    <ul className="ejian-people-show-right">
                                        <li>懂功</li>
                                        <li>职业：建筑师</li>
                                        <li>简介：董工，建筑师，毕业于美国伊洛里落大学</li>
                                    </ul>
                                </div>
                            </Link>
                            <Link to="/baike/detail">
                                <div className="ejian-people-show-reader">
                                    <p>
                                        <img src="http://cdn.zg18.com/jiangzijie.png" />
                                    </p>
                                    <ul className="ejian-people-show-right">
                                        <li>江子杰</li>
                                        <li>职业：建筑师</li>
                                        <li>简介：江子杰，建筑师，毕业于美国伊洛里落大学</li>
                                    </ul>
                                </div>
                            </Link>
                        </div>
                        <div className="ejian-people-show">
                            <Link to="/baike/detail">
                                <div className="ejian-people-show-reader">
                                    <p>
                                        <img src="http://cdn.zg18.com/liuguoyun.png" />
                                    </p>
                                    <ul className="ejian-people-show-right">
                                        <li>刘国云</li>
                                        <li>职业：建筑师</li>
                                        <li>简介：刘国云，建筑师，毕业于美国伊洛里落大学</li>
                                    </ul>
                                </div>
                            </Link>
                            <Link to="/baike/detail">
                                <div className="ejian-people-show-reader">
                                    <p>
                                        <img src="http://cdn.zg18.com/lichun.png" />
                                    </p>
                                    <ul className="ejian-people-show-right">
                                        <li>李春</li>
                                        <li>职业：建筑师</li>
                                        <li>简介：李春，建筑师，毕业于美国伊洛里落大学</li>
                                    </ul>
                                </div>
                            </Link>
                        </div>
                        <div className="ejian-people-show">
                            <Link to="/baike/detail">
                                <div className="ejian-people-show-reader">
                                    <p>
                                        <img src="http://cdn.zg18.com/zhangmingliang.png" />
                                    </p>
                                    <ul className="ejian-people-show-right">
                                        <li>张明梁</li>
                                        <li>职业：建筑师</li>
                                        <li>简介：张明梁，建筑师，毕业于美国伊洛里落大学</li>
                                    </ul>
                                </div>
                            </Link>
                            <Link to="/baike/detail">
                                <div className="ejian-people-show-reader">
                                    <p>
                                        <img src="http://cdn.zg18.com/shuyu.png" />
                                    </p>
                                    <ul className="ejian-people-show-right">
                                        <li>苏玉豪</li>
                                        <li>职业：建筑师</li>
                                        <li>简介：苏玉豪，建筑师，毕业于美国伊洛里落大学</li>
                                    </ul>
                                </div>
                            </Link>
                        </div>
                        <div className="ejian-people-show">
                            <Link to="/baike/detail">
                                <div className="ejian-people-show-reader">
                                    <p>
                                        <img src="http://cdn.zg18.com/wangze.png" />
                                    </p>
                                    <ul className="ejian-people-show-right">
                                        <li>王泽宣</li>
                                        <li>职业：建筑师</li>
                                        <li>简介：王泽宣，建筑师，毕业于美国伊洛里落大学</li>
                                    </ul>
                                </div>
                            </Link>
                            <Link to="/baike/detail">
                                <div className="ejian-people-show-reader">
                                    <p>
                                        <img src="http://cdn.zg18.com/hejia.png" />
                                    </p>
                                    <ul className="ejian-people-show-right">
                                        <li>何家宜</li>
                                        <li>职业：建筑师</li>
                                        <li>简介：何家宜，建筑师，毕业于美国伊洛里落大学</li>
                                    </ul>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="ejian-people-window-footer">
                        <Pagination showQuickJumper defaultCurrent={5} total={120} onChange={this.onChange} />
                    </div>
                </div>
            </div>
        );
    }
}

export default BaikeFirst;
