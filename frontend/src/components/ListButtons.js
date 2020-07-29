import React, { Component } from 'react'
import TaskButton from './TaskButton'

export default class ListButtons extends Component {
    constructor(props) {
        super(props)
    }
//animation when tab is created to show where it is
//queue animation: when oppened or is already opened, 
    buttonFunctions = {                        
        onMouseOver:()=>{return},
        onMouseLeave:()=>{return},
        onDown:()=>{return},
        onClick:()=>{return}
    }
    styling = {
        display : 'block',
        backgroundColor : 'grey', //#676767 and text white
        position : 'relative',
        marginTop : '20px',
        userSelect: 'none',
        width : '250px',
        height : '50px',
        textAlign : 'center',
    }

    render() {      
        return (
            <div
                style={this.styling}
                onClick={(e)=>this.props.openNavTab(this.props.list.name,e.target.children[1].value,this.props.list.listId)}
                >
                    <span style={{lineHeight : '50px', pointerEvents : 'none'}}>{this.props.list.name}</span>
                <select 
                    style={{
                        position : 'absolute',
                        left: '100%'
                    }}
                    onClick={(e)=>e.stopPropagation()}
                    onChange={(e) => {this.props.editViewColour(this.props.list.name,e.target.value)}}> 
                        <option value='#676768'>#676767</option> 
                        <option value='#333399'>#333399</option>
                </select>
                    <span 
                        style={{ 
                            position : 'absolute',
                            top : '30px',
                            left : '228px',
                            float : 'right',                     
                        }}
                    >
                    <TaskButton
                        symbol='⚙️'
                        onClick={(e)=>e.stopPropagation()}
                        buttonFunctions = {this.buttonFunctions}
                        />
                </span>
            </div>
        )
    }
}