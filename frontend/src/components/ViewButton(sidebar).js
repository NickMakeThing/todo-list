import React, { Component } from 'react'

export default class ViewButton extends Component{
    constructor(props){
        super(props)
        this.state = {
            value : '',
            paletteTab : true
        }
    }
    createColour = (colourCode, style, func) => {
        style=Object.assign({backgroundColor:colourCode},style)
        return <span style={style} onClick={func}/>
    }
    ifDisabled = (style) => {
        if (!this.props.disabled) {
            style.opacity = '0.5'
            style.pointerEvents = 'none'
        }
        if (this.props.l){
            style.marginLeft=this.props.l
        }
        return style
    }
    changeTab = () => {
        this.setState({
            paletteTab : !this.state.paletteTab
        })
    }
    buttonStyle = {
        userSelect : 'none',
        display : 'block',
        cursor : 'pointer',
        marginRight : '10px',
        marginLeft : '10px',
        marginBottom : '10px'
    }
    colourStyle = {
        display : 'inline-block',
        margin:'1px',
        width:'20px',
        height:'20px',
        cursor:'pointer',
        borderRadius : '10px',
        border:'solid 1px rgba(0,0,0,0.3)',
        verticalAlign: 'middle' 
    }
    paletteStyle={
        textAlign : 'center',//hmm
        float:'right',
        position:'absolute',
        marginTop:'-18px',
        marginLeft:'52px',
        width:'100px',
        backgroundColor:'rgba(255,255,255,0.2)',
        borderBottomLeftRadius : '10px',
        borderBottomRightRadius : '10px',
        padding:'1px'
    }
    renameStyle={
        backgroundColor : 'rgba(255,255,255,0.2)', 
        border: 'none',
        borderBottom: 'solid 2px', 
        width: '100px',
        position:'absolute',
        top:'10px',
        left:'50px'
    }
    renameButton={
        position:'absolute',
        left:'150px',
        top:'7px'
    }
    renameContainer={
        float:'right',
        marginTop:'-38px',
        marginLeft:'52px'
    }
    paletteTabs = {
        lineHeight : '20px',
        textAlign : 'center',
        fontSize : '80%',
        width : '51px',
        height : '20px',
        backgroundColor:'rgba(255,255,255,0.2)',
        position: 'absolute',
        top:'-20px',
    }
    render(){
        if (this.props.img) {
            var buttonStyle = this.ifDisabled({...this.buttonStyle})
            var button = <img src={this.props.img} 
                            onClick={this.props.func}
                            style={buttonStyle} 
                            width='40' height='35'/>
        } else {
            var symbolStyle = this.ifDisabled((
                    Object.assign({
                        lineHeight : '35px',
                        fontSize:'300%',
                        height : '35px',
                        width : '40px'
                    },{...this.buttonStyle})
            ))
            
            var button = <div style={symbolStyle} 
                            onClick={this.props.func}>
                            {this.props.symbol}
                        </div>
        }
        var paletteStyle = {...this.paletteStyle}
        if (this.props.renameUI && this.props.disabled){
            var ui = (
                <span style={this.renameContainer}>
                    <input style={this.renameStyle}
                        onChange={e=>this.setState({value:e.target.value})} 
                        autoFocus='true'/>
                    <button style={this.renameButton}
                        onClick={(e)=>this.props.func(e,this.state.value)}>
                        rename
                    </button>
                </span>
            )
        } else if(this.props.colourUI){
            var leftFunc,rightFunc
            var tabLeft = Object.assign({left:0,borderTopLeftRadius:'10px'}, {...this.paletteTabs})
            var tabRight = Object.assign({right:0,borderTopRightRadius:'10px'}, {...this.paletteTabs})
            var tabs = <>
                <span style={tabLeft} onClick={leftFunc}>Tasks</span>
                <span style={tabRight} onClick={rightFunc}>View</span></>
            if (!this.props.listView && (!this.state.paletteTab || !this.props.checkBox)){
                tabLeft.filter = 'brightness(70%)'
                tabLeft.cursor = 'pointer'
                leftFunc = this.changeTab
                var colourSet = ['red','#676767','#333399','purple','pink','orange']
                var colourFunc = (e)=>this.props.updateList(e,this.props.listId)
            } else if (this.props.listView) {
                paletteStyle = Object.assign({borderTopLeftRadius:'10px', borderTopRightRadius:'10px'}, paletteStyle)
                paletteStyle.marginTop='-38px'
                tabs = null
                var colourSet = ['red','#676767','#333399','purple','pink','orange']
                var colourFunc = (e)=>this.props.update(e,0)
            } else {
                tabRight.filter = 'brightness(70%)'
                tabRight.cursor = 'pointer'
                rightFunc = this.changeTab
                var colourFunc = this.props.update
                var colourSet = ['red','#079d41','#333399','purple','pink','orange']
            }
            var colours = []
            for (let i of colourSet){
                colours.push(this.createColour(i,this.colourStyle, colourFunc))
            }
            var ui = (
                <span style={paletteStyle}>
                    <span>
                        {tabs}
                    </span>
                    <span style={{width:'100px', }}>
                    {colours}
                    <span style={this.colourStyle}/>{/*put plus sign here and be able to click out*/}
                    </span>
                </span>
            )
        } else if (this.props.descriptionUI){
            var ui = <button onClick={this.props.save} style={{position:'absolute',top:'60px',right:'40px'}}>save</button>

        } else {
            var ui = null
        }
    return (
        <div
            onMouseUp={this.props.mouseUpFix}
            onClick={e=>e.stopPropagation()}>
            {button}
            {ui}
        </div>
        )
    }
}