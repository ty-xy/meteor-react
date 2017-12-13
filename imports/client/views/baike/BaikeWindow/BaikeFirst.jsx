import React, { Component } from 'react';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';

import Icon from '../../../components/Icon';

const Search = Input.Search;
@pureRender
class BaikeFirst extends Component {
    static propTypes = {
        history: PropTypes.object,
    }
    handleSearch=() => {
        const pathname = '/baike/search';
        this.props.history.push({ pathname });
    }
    render() {
        console.log(this.props);
        return (
            <div className="ejianlian-baike-window">
                <div className="ejianlian-baike-fist-page">
                    <Search
                        placeholder="请输入关键词..."
                        size="large"
                        onSearch={this.handleSearch}
                        style={{ width: 900 }}
                        className="baike-search"
                    />
                    <div className="hot-search-word">
                        <div className="hot-search-word-title">
                            <Icon icon="icon-huo" iconColor="#FEC60A" size={24} />
                            <p>热搜词</p>
                        </div>
                        <div
                            className="hot-search-word-body"
                            style={{ width: '900px' }}
                        >
                            <p>涂料哪个牌子好</p>
                            <p>团队协作什么最重要？</p>
                            <p>企业管理</p>
                            <p>涂料哪个牌子好？</p>
                            <p>企业管理</p>
                            {/* <p>企业管理</p>
                            <p>涂料哪个牌子好</p>
                            <p>团队协作什么最重要？</p>
                            <p>企业管理</p>
                            <p>涂料哪个牌子好？</p>
                            <p>企业管理</p>
                            <p>企业管理</p> */}
                        </div>
                    </div>
                    <div className="hot-search-word">
                        <div className="hot-search-word-title">
                            <Icon icon="icon-biaoqian" iconColor="#FF9450" size={24} />
                            <p>热门版块</p>
                        </div>
                        <div className="hot-module">
                            <div className="img-container">
                                <Link to="/baike/people">
                                    <img src="/people.png" />
                                </Link>
                                <Link to="/baike/company">
                                    <img src="/company.png" />
                                </Link>
                                <Link to="/baike/file">
                                    <img src="/wenku.png" />
                                </Link>
                                <Link to="/baike/answer">
                                    <img src="/wenda.png" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BaikeFirst;
