import React, { Component } from 'react'

export default class ViewButton extends Component{
    constructor(props){
        super(props)

    }
    buttonStyle = {
        cursor : 'pointer',
        marginRight : '10px',
        marginLeft : '10px',
    }
    render(){
        if (this.props.img) {
            var button = <img src={this.props.img} 
            onClick={this.props.func}
            style={this.buttonStyle} 
            width='40' height='35'/>
        } else {
            var symbolStyle = Object.assign({
                display : 'inline-block',
                lineHeight : '35px',
                fontSize:'300%',
                height : '35px',
                width : '40px'
            },{...this.buttonStyle})
            if (this.props.disabled) {
                symbolStyle.color = 'rgba(0,0,0,0.5)'
                symbolStyle.cursor = 'default'
            }
            var button = <div style={symbolStyle} onClick={this.props.func}>{this.props.symbol}</div>
        }
        return button
    }
}