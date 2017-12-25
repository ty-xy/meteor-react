import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
class BaikePeopleDetail extends Component {
    render() {
        return (
            <div className="ejianlian-baike-body">
                <div className="ejianlian-baike-people-body">
                    <div className="ejianlian-baike-detail-left">
                        <div>
                            <div className="ejianlian-baike-detail-title">
                                <h3>中艺建筑装饰有限公司</h3>
                            </div>
                            <div className="wangshupeng-detail">
                                <p>
                            中艺建筑装饰有限公司是国务院国资委直属的中国工艺（集团）公司下属的中外合资企业，
                            于1994年4月28日成立。公司注册资金300万美元。
                            公司经营范围：承接室内、外装修，水电设备，消防设备，冷气空调，建筑工程设计及土木施工建设。
                                </p>

                            </div>
                        </div>
                        <div>
                            <img src="http://cdn.zg18.com/zhongyi_product.png" />
                        </div>
                        <div className="zhongyi-detail-c">
                            <h4>公司简介</h4>
                            <div >
                                <p>
                            公司经国家住房与城乡建设部审批为建筑装饰工程专业承包壹级，建筑装饰工程设计甲级企业，房屋建筑工程

                            施工总承包、机电设备安装、建筑智能化、建筑幕墙工程专业承包叁级资质、并经商务部批准获得对外承包工

                            程资质。
                                </p>
                            </div>
                            <div>
                                <p>
                            公司自成立以来，先后完成了中国工艺大厦、外经贸部一号谈判楼、上海金茂凯悦大酒店、北京建国饭店、中

                            国妇联旅行总社、哈尔滨理工大学国际文化教育中心、国家信访局、科技部节能示范楼、北京射击运动学校、

                            当代万国城、北京飞天大厦、苏州国际博览中心、京津新城凯悦酒店、望京新世界商场、首都机场T3航站楼，

                            上海世博会航空馆、吐鲁番博物馆、新疆巴州博物馆、内蒙古喜来登大酒店、天津津塔、北京盘古大观等诸多

                            重点知名工程项目，所施项目多次获得国家优质工程奖、全国建筑工程装饰奖、全国建筑装饰科技创新奖、北

                            京市建筑装饰优质工程奖等荣誉。
                                </p>
                            </div>
                            <div>
                                <p>
                            公司在2001年率先通过了ISO9001国际质量标准体系认证，ISO14000国际环保体系认证和OHSMS18000职业
                                </p>
                                <p>
                            健康安全体系认证，成为建筑装饰行业中较早使用国际化标准进行管理和施工的企业，受到业主及社会各界的
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img src="http://cdn.zg18.com/chinaArt.png" style={{ width: '268px', height: '379px', marginLeft: '24px' }} />
                    </div>
                </div>
            </div>
        );
    }
}

export default BaikePeopleDetail;
