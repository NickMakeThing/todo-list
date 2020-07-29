import React, { Component } from 'react'
import TaskButton from './TaskButton'

export default class CreateTask extends Component {
    constructor(props){
        super(props)
        this.state = {
            name : null,
            taskVisibility : 'none'
        }
    }

    inputHandle = e => {
        console.log(e)
        this.setState({
            name : e.target.value
        })
    }

    buttonHandle = e => {
        this.setState({
            taskVisibility : 'block'
        })
    }

    containerStyle= {
        position : 'fixed',
        top : '140px',
        right : '25%',
    }

    innerStyle = {
        backgroundColor : '#079d41', //temporary
        width : '250px',
        height : '200px',
        marginBottom : '10px'
    }

    taskStyle = {
        position : 'relative',
        backgroundColor : '#079d41',
        userSelect: 'none',
        width : '250px',
        height : '50px',
        textAlign : 'center',
    }

    render(){
        var taskStyle = Object.assign({display : this.state.taskVisibility},this.taskStyle)
        return(
            <div style={this.containerStyle}>
                <div style={this.innerStyle}>
                    Task Name<input onChange={this.inputHandle}/>
                    Description<br/>
                    <textarea/>
                    <button onClick={this.buttonHandle}>Create</button>
                </div>
                <div style={taskStyle}>
                    <span style={{lineHeight: '50px'}}>
                        {this.state.name}
                    </span>
                    <span 
                    style={{ 
                    position : 'absolute',
                    top : '30px',
                    left : '184px',
                    float : 'right',                     
                    }}>
                        <TaskButton
                            buttonFunctions={()=>{}}
                            onClick={()=>{}}
                            symbol='?'
                        />
                        <TaskButton
                            buttonFunctions={()=>{}}
                            onClick={()=>{}}
                            symbol='⚙️'
                        />
                        <TaskButton
                            buttonFunctions={()=>{}}
                            onClick={()=>{}}
                            symbol='+'
                        />
                    </span>
                </div>
            </div>
        )
    }
}