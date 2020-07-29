import React, { Component } from 'react'

export default class Moveable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dragging : '',
        }
    }

    drag = () => {
        this.setState ({
            dragging : 'dragging' 
        })
    }

    drop = (e) => {
        this.setState({
            dragging : '',
        })  
    }

    dragEnter = e => {
        var parent = document.getElementById('all')
        var dragging = document.getElementsByClassName('dragging')[0]
        var mouse = e.clientY
        var box = e.target.getBoundingClientRect()
        var pos = box.bottom - box.height/2
        var lastpos = parent.getElementsByTagName('div')[parent.getElementsByTagName('div').length -1].getBoundingClientRect().bottom - box.height/2
        
        if (mouse < pos){
            parent.insertBefore(
                dragging,
                e.target
            )  
        } else if (mouse > lastpos)  {
            parent.appendChild(dragging)
        }
    }   

    styling = {
        marginTop: '10px',
        width: '50px',
        border: '10px solid',
        borderColor: this.props.color,
    }

    render() {
        return <div 
        style={this.styling} 
        onDragStart={this.drag} 
        onDragEnd={this.drop} 
        onDragOver={this.dragEnter} 
        draggable='true'
        className={this.state.dragging}
        id={this.props.id}
       >
        {this.props.color}
        </div> 
    }
}

