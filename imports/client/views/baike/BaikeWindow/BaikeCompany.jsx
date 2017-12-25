import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Input, Carousel } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Icon from '../../../components/Icon';

const Search = Input.Search;
const SampleNextArrow = ({ className, style, onClick }) => (
    <div
        className={className}
        style={{ ...style, display: 'block', background: 'red' }}
        onClick={onClick}
    />
);
SampleNextArrow.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
};
function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: 'block', background: 'green' }}
            onClick={onClick}
        />
    );
}
SamplePrevArrow.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
};
@pureRender
class BaikeFirst extends Component {
    render() {
        const settings = {
            arrows: true,
            dots: false,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
        };
        return (
            <div className="ejianlian-baike-window">
                <div className="ejianlian-people-window ejian-company-show">
                    <div className="ejian-people-window-title">
                        <div className="ejian-people-window-title-left">
                            <Icon
                                icon="icon-qiye1"
                                iconColor="#29B6F6"
                                size={40}
                            />
                            <p>企业名录</p>
                        </div>
                        <Search
                            placeholder="请输入关键词..."
                            size="large"
                            onSearch={value => console.log(value)}
                            style={{ width: 300, height: 50 }}
                            className="baike-search"
                        />
                    </div>
                    <div className="company-Carousel" style={{ width: '100%' }}>
                        <Carousel {...settings} >
                            <div style={{ textAlign: 'center' }}>
                                <img src="/zhongyi.png" />
                                <p>中艺建筑装饰</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>

                                <img src="/chinabuilding.png" />
                                <p>中国建筑装饰</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <img src="/goldtanglang.png" />
                                <p>金螳螂建筑装饰</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>

                                <img src="/juzhong.png" />
                                <p>居众装饰设计</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>

                                <img src="/shangtai.png" />
                                <p>尚泰装饰设计</p>
                            </div>
                        </Carousel>
                    </div>
                    <ul className="company-list-show">
                        <li className="company-list-show-detail">
                            <div className="company-list-show-detail-left">
                                <img src="/zhongyi.png" />
                                <div>
                                    <p>中艺建筑装饰有限公司</p>
                                    <p>建筑装饰和其他建筑行业</p>
                                </div>
                            </div>

                            <div className="read-detail">
                                <Link to="/baike/companydetail">
                                查看详情
                                </Link>
                            </div>

                        </li>
                        <li className="company-list-show-detail">
                            <div className="company-list-show-detail-left">
                                <img src="/goldtanglang.png" />
                                <div>
                                    <p>苏州金螳螂建筑装饰股份有限公司</p>
                                    <p>房屋建筑业</p>
                                </div>
                            </div>
                            <div className="read-detail">
                            查看详情
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default BaikeFirst;
