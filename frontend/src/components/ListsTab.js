import React, { Component } from 'react'


//give x to close
export default class ListsTab extends Component {

    constructor(props){
        super(props)
        this.state = {
        }
    }

    styling = {
        cursor: 'pointer',
        display: 'inline-block',
        backgroundColor: '#079d41',
        transitionDuration: '0.5s',
        color: 'white',
        paddingTop: '5px',
        paddingBottom: '5px',
        width: '100px',
        marginLeft: '10px',
        horizontalAlign: 'middle',
        textAlign: 'center',
        fontSize: '110%'
    }
    
    render() {
        return <div className='Lists'
        style={this.styling}
        onMouseOver={this.hover}
        onMouseLeave={this.hoverLeave}
        onClick={(e)=>this.props.changeView(e.target.className,e.target.style.backgroundColor)}
        >Lists</div>
    };
}