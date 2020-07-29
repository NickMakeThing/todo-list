import React, { Component } from 'react'

export default class TaskButton extends Component {
    constructor(props){
        super(props)
    }

    styling = {
        color : 'white',
        backgroundColor : 'black',
        display : 'inline-block',
        width : '20px',
        height : '20px',
        //marginLeft : '2px',
        cursor : 'pointer',     
    }

    render () {
        return <div 
        onMouseOver={this.props.buttonFunctions.onMouseOver}
        onMouseLeave={this.props.buttonFunctions.onMouseLeave}
        onMouseDown={this.props.buttonFunctions.onMouseDown}
        onClick={this.props.onClick}
        style={this.styling}>{this.props.symbol}</div>
    }
}