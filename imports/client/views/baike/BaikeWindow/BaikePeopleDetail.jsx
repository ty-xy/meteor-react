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
                                <h3>王澍</h3>
                                <p>（普利兹克建筑奖首位中国籍得主）</p>

                            </div>
                            <div className="wangshupeng-detail">
                                <p>
                    王澍，汉族，1963年11月4日出生于新疆乌鲁木齐市，建筑师。东南大学（原南京工学院）建筑系的本科以及硕士毕业 ，
                    2000年获同济大学建筑学博士。现为中国美术学院建筑艺术学院院长、博士生导师、建筑学学科带头人、浙江省高校中青年学科带头人。
                                </p>
                                <p >
                   2012年2月27日获得了普利兹克建筑奖（Pritzker Architecture Prize），成为获得该奖项的第一个中国人。
                                </p>
                                <p>
                   2016年4月，王澍入选2015年度“长江学者奖励计划”特聘教授名单。
                                </p>
                            </div>
                        </div>
                        <div>
                            <img src="/wangpeng_product.png" />
                        </div>
                        <div className="wangshupeng-detail-c">
                            <h4>早年经历</h4>
                            <p >
                          1963年11月4日王澍出生于新疆维吾尔自治区的乌鲁木齐市，祖籍山西省吕梁市交口县野家坡村Ώ]
                         。成长于新疆、北京、西安。小学、初中均毕业于中铁一局西安子弟学校。
                            </p>
                            <p>
                        1981年毕业于中铁一局西安中学。1981年后游学江南。
                            </p>
                            <p>
                         1981年被东南大学（时称南京工学院）建筑系录取。
                            </p>
                            <p>
                         1985年毕业于南京工学院（现东南大学）建筑系获学士学位。
                            </p>
                        </div>
                        <div className="wangshupeng-detail-c">
                            <h4>职业生涯</h4>
                            <p >

1988年从南京工学院（现东南大学）建筑研究所获建筑学硕士学位（导师：齐康院士），硕士毕业后来到浙江美术学院（现中国美术学院）从事旧楼改造，及环境与建筑关系的研究。1988至1995年在浙江美术学院（现中国美术学院）工作。
1990年建造的海宁青少年宫是王澍的处女作。
1997年王澍与妻子陆文宇一起成立了“业余建筑工作室”。在一篇叫做《业余的建筑》的文章里，王澍阐释“业余”：“强调一种建筑观是业余的，实际上就是在强调自由比准则有更高的价值，并且乐于见到由于对信用扫地的权威的质疑所带来的一点小小的混乱。”
中国建筑师王澍获普利兹克奖
中国建筑师王澍获普利兹克奖
业余工作室只有六个人：王澍夫妇和王澍的四个弟子，他们通常要和一些大型设计院合作，来完成全部的施工图设计。
行内的规矩是，工作室做好设计方案，设计院配一套施工图，就动土开工了。陆文宇不放心，和设计院达成了“新规矩”：第一遍做好的施工图得拿回工作室补充、完善，再请设计院二次矫正，然后给回工作室最终检查、定案。别人只做一道的工序，“业余工作室”得做四道。

                            </p>
                        </div>
                    </div>
                    <div >
                        <img src="/wangpeng.png" style={{ width: '268px', height: '379px', marginLeft: '24px' }} />
                    </div>
                </div>
            </div>
        );
    }
}

export default BaikePeopleDetail;
