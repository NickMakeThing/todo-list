import React, { Component } from 'react'


//give x to close
export default class ListsTab extends Component {

    constructor(props){
        super(props)
        this.tab = React.createRef()
    }
    componentDidUpdate(prevProps){
        if(prevProps.tabPosMod != this.props.tabPosMod ){
            this.props.passRect(this.tab.current.getBoundingClientRect().left,'list')
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
        return <div ref={this.tab}
            viewName='Lists'
            style={this.styling}
            onMouseOver={this.hover}
            onMouseLeave={this.hoverLeave} 
            onClick={(e)=>this.props.changeView(this.props.viewName,e.target.style.backgroundColor)}>
            Lists
        </div>
    };
}