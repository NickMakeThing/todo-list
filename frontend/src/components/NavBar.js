import React, { Component } from 'react'
import NavTab from './NavTab'
import ListsTab from './ListsTab'

export default class NavBar extends Component {

    constructor(props){
        super(props)
    }

    barStyle = {
        paddingTop: '5px',
        backgroundColor: '#373737'
    }

    render() {
        var tabs=[]
        for (let i in this.props.views) {
            tabs.push(
            <NavTab closeNavTab={this.props.closeNavTab} 
            className={i} 
            colourCode={this.props.views[i].colourCode}
            changeView={this.props.changeView}
            activeView={this.props.activeView}/>
            ) 
        } 

        return (
            <header 
            style={this.barStyle}>
                    <ListsTab changeColour={this.props.changeColour}
                    changeView={this.props.changeView}/>
                    {tabs} 
            </header>
        )
    };
}