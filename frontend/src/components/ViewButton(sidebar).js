import React, { Component } from 'react'

export default class ViewButton extends Component{
    constructor(props){
        super(props)
        this.chooseColour=React.createRef()
        this.state = {
            value : '',
            paletteTab : true,
            customColour : 'none'
        }
    }
    customColourHandle = e =>{
        this.setState({
            customColour : e.target.value
        })
    }
    colourForm=()=>{
        if (this.props.img != 'colour.png'){return}
        if (this.state.customColourForm == 'inline' || !this.props.colourUI){
            var display = 'none'
        } else if (this.state.customColourForm == 'none'){
            var display = 'inline'
        }
        this.setState({
            customColourForm : display
        })
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
        userSelect : 'none',
        color : 'rgba(0,0,0,0.5)',
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
        userSelect : 'none',
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
                            onClick={e=>{this.props.func(e);this.colourForm()}}
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
                        maxLength={40}
                        onChange={e=>this.setState({value:e.target.value})} 
                        autoFocus='true'/>
                    <button style={this.renameButton}
                        onClick={(e)=>this.props.func(e,this.state.value)}>
                        rename
                    </button>
                </span>
            )
        } else if(this.props.colourUI){
            var tabLeft = Object.assign({left:0,borderTopLeftRadius:'10px'}, {...this.paletteTabs})
            var tabRight = Object.assign({right:0,borderTopRightRadius:'10px'}, {...this.paletteTabs})
            if (!this.props.listView && this.state.paletteTab){//task tab on View
                tabRight.filter = 'brightness(70%)'
                tabRight.cursor = 'pointer'
                var colourSet = ['#333399','purple','#00d6bd','#a90a0a','#079d41','#df7334','#a9993c','pink']
                var rightFunc = this.changeTab
                var colourFunc = this.props.update
            } else if (!this.props.listView && !this.state.paletteTab){
                tabLeft.filter = 'brightness(70%)'//view tab on View
                tabLeft.cursor = 'pointer'
                var colourSet = ['#333399','purple','#00d6bd','#a90a0a','#40cc3e','#df7334','#a9993c','pink']
                var leftFunc = this.changeTab
                var colourFunc = (e)=>this.props.updateList(e,this.props.listId)
            
            } else if (this.props.listView) { //palette on ListView
                paletteStyle = Object.assign({borderTopLeftRadius:'10px', borderTopRightRadius:'10px'}, paletteStyle)
                paletteStyle.marginTop='-38px'
                var colourSet = ['#333399','purple','#00d6bd','#a90a0a','#40cc3e','#df7334','#a9993c','pink']
                var colourFunc = (e)=>this.props.update(e)
            }
            var tabs = this.props.listView ? null : <>
                <span style={tabLeft} onClick={leftFunc}>Tasks</span>
                <span style={tabRight} onClick={rightFunc}>View</span></>
            var colours = []
            for (let i of colourSet){
                colours.push(this.createColour(i,this.colourStyle, colourFunc))
            }
            var ui = (
                <span style={paletteStyle}>
                    <span>
                        {tabs}
                    </span>
                    <span style={{width:'100px'}}>
                        {colours}
                       {/*option to add custom colour. works, but looked horrible. 
                        <span style={this.colourStyle} onClick={this.colourForm}>+
                            <div style={{display:this.state.customColourForm}}>
                                <button onClick={e=>{e.stopPropagation();this.chooseColour.current.click()}}>
                                    Choose
                                </button>
                                <input type='color'
                                    style={{display:'none'}}
                                    ref={this.chooseColour}
                                    onClick={e=>e.stopPropagation()}
                                    onChange={this.customColourHandle}/>
                                <button style={{backgroundColor : this.state.customColour}}
                                    onClick={colourFunc}>Submit</button>
                            </div>
                        </span>*/}
                    </span>
                </span>
            )
        } else if (this.props.descriptionUI){
            var ui = <button onClick={this.props.save} style={{position:'absolute',top:'60px',right:'40px'}}>save</button>

        } else {
            var ui = null
        }
    return (
        <div style={this.props.style}//for description button
            onMouseUp={this.props.mouseUpFix}
            onClick={e=>e.stopPropagation()}>
            {button}
            {ui}
        </div>
        )
    }
}