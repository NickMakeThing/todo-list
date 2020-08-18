import React, { Component } from 'react'
import TaskButton from './TaskButton'
import CheckBox from './CheckBox'

export default class Task extends Component {
    constructor(props) {
        super(props)
        this.textSpan = React.createRef()
        this.state = {
            taskColour : this.props.colour,
            lineHeight : '50px',
            wordBreak : ''
        }
    }

    changeTaskColour = e => {
        this.setState({
            taskColour : e.target.value
        })
    }

    preventPropogation = e => {
        e.stopPropagation()
    }

    hover = e => {
        if(!this.props.dragging){
            e.target.style.textShadow = '0px 0px 8px cyan'
        }
    }
    
    hoverEnd = e => {
        e.target.style.textShadow = 'none'
    }

    optionsClick = e => {
        if (this.state.optionsVisibility == 'none') {
            this.setState({
                optionsVisibility : 'inline-block'
            })
        } else {
            this.setState({
                optionsVisibility : 'none'
            })
        }
    }

    descriptionClick = e => {
        console.log('description')
    }

    buttonFunctions = {
        onMouseOver : this.hover,
        onMouseLeave : this.hoverEnd,
        onMouseDown : this.preventPropogation
    }

    defaultStyle = {
        userSelect : 'none',
        width : '250px',
        height : '50px',
        textAlign : 'center',
    }
    textStyle = {
        position: 'absolute', 
        left: '30px', 
        width:'200px',
        fontSize:'90%' 
    }
    componentDidMount(){
        if(this.textSpan.current.scrollWidth>200){
            this.setState({
                lineHeight:'25px',
                wordBreak:'break-all'
            })
        }
    }
    render() {
        var textStyle = Object.assign({
            lineHeight : this.state.lineHeight, 
            wordBreak : this.state.wordBreak
        },{...this.textStyle})
        if (!this.state.wordBreak){
            textStyle['whiteSpace'] = 'nowrap'
        }
        var innerText = this.props.completed ? <s>{this.props.name}</s> : this.props.name
        var check = this.props.selected ? '✔' : ''
        if (this.props.dragging && this.props.dragging.name == this.props.name) {
            var styling = Object.assign({
                pointerEvents : 'none',
                zIndex : 1,
                position : 'fixed',
                top : (this.props.mouse.y-25)+'px',
                left : (this.props.mouse.x-125)+'px',
                backgroundColor :  this.props.colour,
            },this.defaultStyle)

            var ghostDiv = <div style={{
                position : 'relative',
                marginTop : '20px',
                marginLeft : this.props.marginLeft,
                width : '250px',
                height : '50px',
                transform : this.props.size
          }}>
            </div>
        } else {
            var styling = Object.assign({
                marginLeft : this.props.marginLeft,
                position : 'relative',
                marginTop : '20px',               
                backgroundColor :  this.props.colour,
            },this.defaultStyle)
            
            var ghostDiv = null
        }    
        return( 
            <>
            <div style={styling}
                onClick={e=>e.stopPropagation()}
                onMouseUp={this.props.mouseUpFix}
                onMouseOver={e =>this.props.dragOver(e,this.props.priority)}
                onMouseDown={e =>this.props.dragStart(e,this.props.priority,this.props.name)}
            >
                <CheckBox
                    position={'absolute'}
                    top={'50%'}
                    left={'15px'} 
                    priority={this.props.priority} 
                    preventPropogation={this.preventPropogation}
                    select={this.props.selectTask}
                    check={check}/>
                <span 
                    style={{ 
                    position : 'absolute',
                    top : '30px',
                    left : '230px',
                    float : 'right',                     
                }}>
                    <TaskButton
                        buttonFunctions={this.buttonFunctions}
                        mouseUpFix={this.props.mouseUpFix}
                        onClick={e=>this.props.openDescription(e,this.props.priority)}
                        symbol='?'
                    />
                    </span>
                <div ref={this.textSpan}
                    style={textStyle}>
                    {innerText}
                </div> 

            </div> 
            {ghostDiv}
            </>
        )
    }
}