import React, { Component } from 'react'
import TaskButton from './TaskButton'
import CheckBox from './CheckBox'

export default class Task extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskColour : this.props.colour,
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
        //this.state is undefined when putting this.state.taskcolour here
    }
    
    render() {
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
        //in options when reordering tasks:
        //name value changes to the task moved to dragged tasks old position
        //also task moved to that position is changed to the dragged's task colour 
        //dragged task name follows to the new position, but colour changes to the 
        //colour of the task that was in that position before
        //i know that putting these values in tasks state as a single object will solve it
        //but before i do that i want to know more about why/how it happens
        return( 
            <>
            <div style={styling}
                onMouseOver={e =>this.props.dragOver(e,this.props.priority)}
                onMouseDown={() => this.props.dragStart(this.props.priority,this.props.name)}
            >
                <CheckBox
                    position={'absolute'}
                    top={'50%'}
                    left={'15px'} 
                    priority={this.props.priority} 
                    preventPropogation={this.preventPropogation}
                    selectTask={this.props.selectTask}
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
                        onClick={this.descriptionClick}
                        symbol='?'
                    />
                    </span>
                <span 
                    style={{lineHeight : '50px'}}>
                    {this.props.name}
                </span> 

            </div> 

            {ghostDiv}
            </>
        )
    }
}