import React from 'react';
import {
    Route,
} from 'react-router-dom';
import BaikeFirst from './BaikeWindow/BaikeFirst';
import BaikePeople from './BaikeWindow/BaikePeople';
import BaikePeopleDetail from './BaikeWindow/BaikePeopleDetail';
import BaikeFile from './BaikeWindow/BaikeFile';
import BaikeAnswer from './BaikeWindow/BaikeAnswer';
import BaikeCompany from './BaikeWindow/BaikeCompany';
import BaikeCompanyDetail from './BaikeWindow/BaikeCompanyDetail';


export default () => (
    <div className="baike-window-total">
        <Route exact path="/baike" component={BaikeFirst} />
        <Route path="/baike/people" component={BaikePeople} />
        <Route path="/baike/detail" component={BaikePeopleDetail} />
        <Route path="/baike/file" component={BaikeFile} />
        <Route path="/baike/answer" component={BaikeAnswer} />
        <Route path="/baike/company" component={BaikeCompany} />
        <Route path="/baike/companydetail" component={BaikeCompanyDetail} />
    </div>
);
