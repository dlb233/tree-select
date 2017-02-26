/**
 * Created by Toulon on 2017/2/22.
 *
 * Copyright (c) 2017-present Dulingbo,SefonSoft Company, Inc.
 * All rights reserved.
 *
 * Author information:
 * Email:dulingbo@sefonSoft.com
 * Company:Sefon Soft.ChengDu
 * file information(文件功能):
 */
import React,{Component} from 'react'
import './TreeSelect.scss'
import * as jtools from '../common/commonFunc.js'

const recursion = Symbol("recursion");
const confirmSelect = Symbol("confirmSelect"),
      resetChosen = Symbol("resetChosen");


/**
 * 遗留问题
 * 1.目前很多地方是使用forceUpdate强制更新，后期改为immutable结构
 * 2.搜索接口todo...
 * 3.异步请求写成async函数
 * 4.组件可继续拆分
 *
 * 可接受参数
 * @param data 初始数据，树形结构
 * @param asycUrl 异步请求数据url
 * */
class TreeSelect extends Component{
    constructor(props){
        super(props);
        this.state = {
            isShow: props.isShow === undefined ? false : props.isShow,
            data: this.props.data||[],          //全部下拉数据
            selectedIds:new Set([]),   //上一次选中的id
            selectedNames:new Set([]), //上一次选中的name
            inputValue: ''    //搜索框数据
        }
    }

    /**
     * 搜索节点
     * */
    searchArea =()=> {
        //todo...
    }

    /**
     * 切换弹出框显示
     * */
    toggleBox=()=>{
        this.setState({
            isShow:!this.state.isShow
        })
    }

    /**
     * 改变搜索框输入
     * */
    changeInput=(e)=>{
        this.setState({
            inputValue:e.target.value
        })
    }

    /**
     * 切换孩子显示状态
     * */
    toggleChildren=(sub)=>{
        let _this = this;
        if(!sub.children && this.props.asycUrl){
            //todo..改造成asyc函数
            ajax.get(this.props.asycUrl).query({parentId:sub.id}).exchange((err, res) => {
                sub.children=res.body.data;
                _this.forceUpdate();
            });
        }
        sub.isSpread = !sub.isSpread;
        if(!sub.isSpread){
            this.hideAllOffspring(sub);
        }
        _this.forceUpdate();
    }

    /**
     * 切换孩子选中状态
     * */
    toggleChildrenSelection=(sub)=>{
        if(sub.childrenChosen!=="all"){ //全选
            sub.isChosen = true;
            //所有后代节点全部选中
            this.toggleAllOffspringChosen(sub,true);
            sub.childrenChosen = "all";
        }else{
            sub.childrenChosen = "none";
            sub.isChosen = false;
            this.toggleAllOffspringChosen(sub,false);
        }
        this.forceUpdate();
    }

    /**
     * 叶子节点选中事件
     * */
    leftSelected=(target,sub,father)=>{
        //切换选中状态
        sub.isChosen = !sub.isChosen;

        //刷新父辈状态
        this.refreshAncestorStatus(sub);

        this.forceUpdate();
    }

    /**
     * 根据当前节点状态递归刷新父辈状态
     * */
    refreshAncestorStatus=(node)=>{
        let root = {children:this.state.data,root:true};
        this[recursion](root,node);
    }

    /**
     * 递归更新父节点状态
     * */
    [recursion](root,node){
        let father = this.findNode(root,node.id);//父节点
        if(!father.root){ //到根节点则停止
            this.refreshBranchNodeStatus(father);
            this[recursion](root,father);
        }

    }


    /**
     * 寻找当前节点的父节点
     * */
    findNode=(node,id)=> {

        if(node.children && node.children.length>0){
            for(let item of node.children){
                if(item.id===id) return node;
                if(item.children && node.children.length>0){
                    let temp = this.findNode(item,id);
                    if(temp) return temp;
                }

            }
        }
    }

    /**
     * 刷新有子节点的节点状态
     * */
    refreshBranchNodeStatus=(node)=>{
        let count=0;
        for(let item of node.children){
            if(item.isChosen) count++;
        }
        if(!count){
            node.childrenChosen = "none";
            node.isChosen=false;
        }else if(count===node.children.length){
            node.childrenChosen = "all";  //全部选中
            node.isChosen = true;
        }else{
            node.childrenChosen = "some"; //部分选中
            node.isChosen=false;
        }
    }

    /**
     * 自己的子节点选中状态
     * */
    getChildrenChosenStatus=(node)=>{
        if(node.children){
            let count=0;
            for(let item of node.children){
                if(item.isChosen) count++;
            }
            if(!count){
                return "none"; //0选中
            }else if(count===node.children.length){
                return "all";  //全部选中
            }else{
                return "some"; //部分选中
            }
        }
    }


    /**
     * 选中或取消所有后代的选中状态
     * @param node 当前节点
     * @param flag 要修改的状态，true和false
     * */
    toggleAllOffspringChosen=(node,flag)=>{
        let _this = this;
        node.isChosen = flag;
        if(node.children && node.children.length>0){
            node.childrenChosen = flag?"all":"none";
        }
        if(Array.isArray(node.children)){
            for(let item of node.children){
                _this.toggleAllOffspringChosen(item,flag);
            }
        }
    }

    /**
     * 将所有后代的isSpread和visible改为false
     * */
    hideAllOffspring=(sub)=>{
        let _this = this;
        if(sub.children && sub.children.length>0){
            for(let item of sub.children){
                item.isSpread = false;
                item.visible = false;
                _this.hideAllOffspring(item);
            }
        }
    }

    /**
     * 渲染列表
     * */
    makeList = (data, subs = "",father=null) => {
        if (data === undefined) {
            return "";
        } else if (data.length === 0) {
            return (<h1 id="areaSelectNoresult">没有数据</h1>)
        }
        return data.map((sub, i) => {
            let _subs = subs === "" ? `${sub.name}` : `${subs} > ${sub.name}`;
            if (!sub.children) {
                let klass = sub.isChosen? `treeLeft leftActive` : `treeLeft`;
                return(
                    <li data-desc={sub.desc} key={i}
                        onClick={(e)=>{this.leftSelected(e.target,sub,father)}}
                        data-value={_subs} data-id={sub.id}
                        className={klass}>
                        <label>{sub.name}</label>
                    </li>
                );
            }

            return <li className="has-children" key={i} data-desc={sub.desc} data-value={_subs} data-id={sub.id}>
                <input type="checkbox" name="group" id={sub.id}/>
                <span className={"spread"+(sub.isSpread?" treeSelect_minas":" treeSelect_plus")}
                      onClick={(e)=>{this.toggleChildren(sub)}}></span>
                <span className={"select_all_btn "+(sub.childrenChosen||"none")} onClick={(e)=>{this.toggleChildrenSelection(sub)}}></span>
                <label className="name">
                    {sub.name}
                </label>
                <ul className={sub.isSpread?"tree_select_ul":"tree_select_ul hide"}>
                    {this.makeList(sub.children, _subs,sub)}
                </ul>
            </li>;
        })
    }

    /**
     * 确定
     * */
    confirm=()=> {
        this[confirmSelect]();
        //关闭弹窗
        this.toggleBox();
    }


    /**
     * 取消
     * */
    cancel=()=>{
        let {data,selectedIds} = this.state;

        //按照selectedIds中的值重新设置选中状态
        this[resetChosen](data,selectedIds);

        //关闭弹窗
        this.toggleBox();
    }

    /**
     * 以当前选中的所有节点来更新selectIds和selectedNames列表
     * */
    [confirmSelect](){
        const {data} = this.state;
        let selectedIds = new Set([]),
            selectedNames = new Set([]);
        this.confirmRecursion(data,selectedIds,selectedNames,"");
        this.setState({
            selectedIds,
            selectedNames
        });
    }

    /**
     * 递归更新selectedIds和selectedNames
     * */
    confirmRecursion=(data,selectedIds,selectedNames,subName)=>{
        if(data && data.length>0){
            for(let item of data){
                let newName = `${subName}${subName?">":""}${item.name}`;
                if(item.isChosen){ //如果节点被选中，则不用再统计其子节点
                    selectedIds.add(item.id);
                    selectedNames.add(newName);
                }else{
                    this.confirmRecursion(item.children,selectedIds,selectedNames,newName);
                }
            }
        }
    }

    /**
     * 递归设置选中
     * */
    [resetChosen](data,selectedIds){
        if(data && data.length>0){
            for(let item of data){
                let isChoen = selectedIds.has(item.id);
                item.isChosen = isChoen;
                if(isChoen){ //节点选中则其后代全部选中
                    this.toggleAllOffspringChosen(item,true);
                }else {
                    (item.children && item.children.filter(x=>selectedIds.has(x.id)).length > 0) ?
                        (item.childrenChosen = "some") :
                        (item.childrenChosen = "none");
                    this[resetChosen](item.children,selectedIds);
                }
            }
        }
    }

    render(){
        let { isShow, inputValue = '',selectedNames } = this.state;
        let popUpClass = isShow ? "area_choose caseDetail-area forSaveAs" : "hide";
        return(
            <div className="area_select">
                <div className={popUpClass}>
                    <div className="area_search">
                        <div id="area_search_ctn">
                            <input type="text" value={inputValue} onChange={this.changeInput} placeholder={"搜索"}
                                   maxLength="80" className="area_input"
                                   onKeyDown={(e) => {e.keyCode == '13' && this.searchArea()}}/>
                            <em className="search_icon" onClick={this.searchArea}></em>
                        </div>
                    </div>
                    <div className="area_select_shadowCover">
                        <ul className="cd-accordion-menu animated tree_select_ul">
                            {this.state.data?this.makeList(this.state.data):''}
                        </ul>
                    </div>
                    <div className="area_select_buttons">
                        <span onClick={this.confirm}>确定</span>
                        <span onClick={this.cancel}>取消</span>
                    </div>
                </div>
                <ShowSelectionBox toggleBox={this.toggleBox} isShow={isShow} selectedNames={selectedNames}/>
            </div>
        )
    }
}

class ShowSelectionBox extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {isShow,toggleBox,selectedNames} = this.props;
        return(
            <div>
                <input type="text" id='inputTxt' title={[...selectedNames].join()}
                       value={[...selectedNames].join()}
                       data-id={""}
                       data-desc={""}
                       readOnly={true}
                       maxLength="80"
                       onClick={toggleBox}/>
                <img src="images/areaSelectDownBg.png" id="areaInputBg" className={isShow ? `up` : ''}
                     onClick={toggleBox}/>
            </div>
        )
    }
}

export default TreeSelect;