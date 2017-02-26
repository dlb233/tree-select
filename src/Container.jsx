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

    id:"1",//节点唯一标识符
    name:"1",   //节点名
    children:[{
        isSpread:false,
        isVisible:true,

        id:"2",
        name:"1-1",
        children:[{
            isSpread:false,
            isVisible:true,

            id:"4",
            name:"1-1-1"
        },{
            isSpread:false,
            isVisible:true,

            id:"5",
            name:"1-1-2"
        }]
    },{
        isSpread:false,
        isVisible:true,

        id:"3",
        name:"1-2"
    }] //孩子节点
},{
    isSpread:false,
    isVisible:true,

    id:"t2",
    name:"2"
}]

class Container extends Component{
    render() {
        return (
            <div style={{height:"1000px"}}>
                <div style={{height:"600px"}}></div>
                <TreeSelect data={fakeData}/>
            </div>
        );
    }
}

export default Container