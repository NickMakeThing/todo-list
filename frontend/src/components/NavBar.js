import React, { Component } from 'react'
import NavTab from './NavTab'
import ListsTab from './ListsTab'

export default class NavBar extends Component {

    constructor(props){
        super(props)

        this.state={
            views:[],
            lastTabPos:0,
            listTabPos:0,
            tabPosMod:0,
            windowW:window.innerWidth
        }
        this.handleResize = this.handleResize.bind(this)
    }
    passRect = (pos,type) => {
        if (type=='list'){
            this.setState({
                listTabPos : pos
            })
        } else {
            this.setState({
                lastTabPos : pos
            })
        }
    }
    handleResize(WindowSize, event) {
        this.setState({windowW: window.innerWidth})
    }
    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        window.addEventListener("resize", null);
    }
    componentWillUpdate(nextProps){
        //this is so tabs will be displayed in the order that they are opened
        var next = Object.keys(nextProps.views).length
        var thisprops = Object.keys(this.props.views).length
        var views = [...this.state.views]
        if (next > thisprops){
            for (let i in nextProps.views){
                if (!this.state.views.includes(i)){
                    views.push(i)
                }
            }
            this.setState({
                views:views
            })
        } else if (next < thisprops) {
            for (let i of views){
                if (!Object.keys(nextProps.views).includes(i)){
                    views.splice(views.indexOf(i),1)
                }
            }
            this.setState({
                views:views
            })
        }
    }
    lastTabClick = e =>{
        e.stopPropagation()
        if(this.state.lastTabPos>this.state.windowW){//unnecassery? 
            this.setState({
                tabPosMod:this.state.tabPosMod-50
            })
        }
    }
    listTabClick = e =>{
        e.stopPropagation()
            this.setState({
                tabPosMod:this.state.tabPosMod+50
            })
    }
    barStyle = {
        userSelect:'none',
        paddingTop: '5px',
        backgroundColor: '#373737',
        width : '100%',
        whiteSpace: 'nowrap'
    }
    scrollStyle={
        position:'absolute',
        zIndex:'1',
        marginTop:'-5px',
        textAlign: 'center',
        height: '36px',
        width:'20px',
        lineHeight:'36px',
        color:'white',
        backgroundColor:'black'
    }

    render() {
        var barStyle = Object.assign({left:this.state.tabPosMod},this.barStyle)
        var scrollLeft,scrollRight
        if (this.state.lastTabPos > this.state.windowW){
            var right = Object.assign({right:0},{...this.scrollStyle})
            scrollRight=<span style={right} 
                onClick={this.lastTabClick}>
                ▶
            </span>
        }
        if (this.state.listTabPos < 0) {
            var left = Object.assign({left:0},{...this.scrollStyle})
            scrollLeft=<span style={left} 
                onClick={this.listTabClick}>
                ◀
            </span>
        }
        var tabs=[]
        var count=0
        var size=this.state.views.length
        var func =()=>{return}
        for (let i of this.state.views) {
            if(count==size-1){
                func = this.passRect
            }
            if (this.props.views[i]){
                tabs.push(
                <NavTab closeNavTab={this.props.closeNavTab} 
                    size={size}
                    tabPosMod={this.state.tabPosMod}
                    className={i} 
                    passRect={func}
                    colourCode={this.props.views[i].colourCode}
                    changeView={this.props.changeView}
                    activeView={this.props.activeView}/>
                ) 
            }
            count++
        }
        return (
            <header style={barStyle}>
                {scrollLeft}
                <span style={{marginLeft:this.state.tabPosMod}}>
                    <ListsTab changeColour={this.props.changeColour}
                        changeView={this.props.changeView}
                        tabPosMod={this.state.tabPosMod}
                        passRect={func}/>
                    {tabs}
                </span>
                {scrollRight}
            </header>
        )
    };
}