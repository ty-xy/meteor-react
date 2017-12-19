import React, { Component } from 'react';
import { Input, Tabs } from 'antd';
import pureRender from 'pure-render-decorator';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
@pureRender

class BaikeSearch extends Component {
    render() {
        return (
            <div className="ejian-lian-search">
                <Search
                    placeholder="中艺建筑"
                    size="large"
                    onSearch={value => console.log(value)}
                    style={{ width: 800 }}
                    className="baike-search-list"
                />
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="全部" key="1">
                        <ul>
                            <li className="search-list-total">
                                <h4><a>BIM</a>装饰有限公司 知工百科</h4>
                                <p>
                                    <a>BIM</a>装饰有限公司是国务院国资委直属的中国工艺（集团）公司下属的中外合资企业，
                                    于1994年4月28日成立。公司注册资金300万美元。公司经营范
                            围：承接室内、外装修，水电设备，消防设备，冷气空调，建筑工…
                                </p>
                            </li>
                            <li className="search-list-total">
                                <h4>上海<a>装配式建筑</a>建设集团有限公司 知工百科</h4>
                                <p>
                                上海 <a>中艺建设</a>集团有限公司积极迎合国家培植产业的大战略，
                                专注各地方优势产业，围绕城市基础与公共服务设施投资建设、新型城镇化开发建设运营、功能
                                性投资服务等三大平台，落实“五项核心业务”（即承担政府重大…
                                </p>
                            </li>
                            <li className="search-list-total">
                                <h4><a>智能建筑</a>装饰有限公司 知工百科</h4>
                                <p>
                                    <a>智能建筑</a>装饰有限公司是国务院国资委直属的中国工艺（集团）公司下属的中外合资企业，
                                    于1994年4月28日成立。公司注册资金300万美元。公司经营范
                            围：承接室内、外装修，水电设备，消防设备，冷气空调，建筑工…
                                </p>
                            </li>
                            <li className="search-list-total">
                                <h4><a>建筑工业化</a>装饰有限公司 知工百科</h4>
                                <p>
                                    <a>建筑工业化</a>装饰有限公司是国务院国资委直属的中国工艺（集团）公司下属的中外合资企业，
                                    于1994年4月28日成立。公司注册资金300万美元。公司经营范
                            围：承接室内、外装修，水电设备，消防设备，冷气空调，建筑工…
                                </p>
                            </li>
                            <li className="search-list-total">
                                <h4><a>营改增 PPP </a>装饰有限公司 知工百科</h4>
                                <p>
                                    <a>营改增 PPP </a>装饰有限公司是国务院国资委直属的中国工艺（集团）公司下属的中外合资企业，
                                    于1994年4月28日成立。公司注册资金300万美元。公司经营范
                            围：承接室内、外装修，水电设备，消防设备，冷气空调，建筑工…
                                </p>
                            </li>
                            <li className="search-list-total">
                                <h4><a> 保证金</a>装饰有限公司 知工百科</h4>
                                <p>
                                    <a> 保证金</a>装饰有限公司是国务院国资委直属的中国工艺（集团）公司下属的中外合资企业，
                                    于1994年4月28日成立。公司注册资金300万美元。公司经营范
                            围：承接室内、外装修，水电设备，消防设备，冷气空调，建筑工…
                                </p>
                            </li>
                        </ul>
                    </TabPane>
                    <TabPane tab="人物" key="2">Content of Tab Pane 2</TabPane>
                    <TabPane tab="企业" key="3">Content of Tab Pane 3</TabPane>
                    <TabPane tab="文库" key="4">Content of Tab Pane 3</TabPane>
                    <TabPane tab="问答" key="5">Content of Tab Pane 3</TabPane>
                </Tabs>
            </div>
        );
    }
}

export default BaikeSearch;
