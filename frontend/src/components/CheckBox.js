import React, { Component } from 'react'

export default class CheckBox extends Component {
    constructor(props){
        super(props)
    }


    render() {

        return <span
        onMouseOver={e=>{
            e.target.style.backgroundColor='rgba(250,250,250,1)'
        }}
        onMouseLeave={e=>{
            e.target.style.backgroundColor='rgba(240,240,240,1)'
        }}
        onMouseDown={this.props.preventPropogation}
        onClick={()=>this.props.selectTask(this.props.priority)}
        style={{
            display : 'inline-block',
            //tick needs to be moved to the left slightly
            userSelect : 'none',
            //cursor : 'pointer',
            color : 'black',
            lineHeight : '9px',
            position : this.props.position,
            top: this.props.top,
            transform: 'translateY(-50%)',
            height : '10px',
            width : '10px',
            left : this.props.left,
            border : '1px solid rgba(200,200,200,1)',
            backgroundColor : 'rgba(240,240,240,1)'
        }}>
            {this.props.check}
        </span>
    }
}