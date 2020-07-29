import React, { Component } from 'react'

//user can customize colour of tab and its view in the list view
export default class NavTab extends Component {

    constructor(props){
        super(props)
    }
    /*
    onMouseOver={this.hover}
    onMouseLeave={this.hoverLeave}
    
    hover = e => {
        //later add preventing of text select/highlight
        e.target.style.backgroundColor = '#797979'
        e.preventDefault()
    }
    hoverLeave = e => {
        e.target.style.backgroundColor = '#676767'
    }*/

    xstyle = {
        fontSize: '90%',
        color: 'black',
    }
    
    render() {
        var styling = {
            cursor: 'pointer',
            display: 'inline-block',
            backgroundColor: this.props.colourCode,
            //transitionDuration: '0.5s',
            color: 'white',
            paddingTop: '5px',
            paddingBottom: '5px',
            width: '100px',
            marginLeft: '10px',
            horizontalAlign: 'middle',
            textAlign: 'center',
            fontSize: '110%'
            //float: 'left',
        }
        
        if (this.props.activeView != this.props.className) {
            styling.filter = 'brightness(95%)' //can also do this by just making the text a different colour
        }
        if (this.props.className.length > 7){
            var text = this.props.className.slice(0,5)+'...'
        } else {
            var text = this.props.className
        }

        return <div
        className={this.props.className}
        style={styling}
        onClick={(e)=>this.props.changeView(e.target.className,e.target.style.backgroundColor)}>
            <span 
            style={this.xstyle}
            onClick={this.props.closeNavTab}
            >x</span>
            {text}
        </div>
    };
}