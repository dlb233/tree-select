/**
 * Created by LuoJia on 2017/2/16.
 *
 * Copyright (c) 2017-present Dulingbo,SefonSoft Company, Inc.
 * All rights reserved.
 *
 * Author information:
 * Email:dulingbo@sefonSoft.com
 * Company:Sefon Soft.ChengDu
 * file information(文件功能):
 */

import React, {Component} from 'react'

import TreeSelect from './treeSelect/TreeSelect.jsx'

const fakeData = [{
    isSpread:false,//该节点是否展开
    isVisible:true,//是否显示

    id:"节点唯一标识符",
    name:"1",   //节点名
    children:[] //孩子节点
}]

class Container extends Component{
    render() {
        return (
            <div style={{height:"600px"}}>
                <TreeSelect option={fakeData}/>
            </div>
        );
    }
}

export default Container