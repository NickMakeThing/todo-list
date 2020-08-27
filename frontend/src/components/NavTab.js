import React, { Component } from 'react'

//user can customize colour of tab and its view in the list view
export default class NavTab extends Component {

    constructor(props){
        super(props)
        this.tab = React.createRef()
    }

    xstyle = {
        fontSize: '90%',
        color: 'black',
    }
    componentDidUpdate(prevProps){
        if(prevProps.size != this.props.size || prevProps.tabPosMod != this.props.tabPosMod){
            this.props.passRect(this.tab.current.getBoundingClientRect().right)
        }
    }
    componentDidMount(){
        this.props.passRect(this.tab.current.getBoundingClientRect().right)
    }
    render() {
        var styling = {
            cursor: 'pointer',
            display: 'inline-block',
            backgroundColor: this.props.colourCode,
            color: 'white',
            paddingTop: '5px',
            paddingBottom: '5px',
            width: '100px',
            marginLeft: '10px',
            horizontalAlign: 'middle',
            textAlign: 'center',
            fontSize: '110%',
        }
        if (this.props.activeView != this.props.viewName) {
            styling.filter = 'brightness(95%)' 
        }
        if (this.props.viewName.length > 7){
            var text = this.props.viewName.slice(0,5)+'...'
        } else {
            var text = this.props.viewName
        }

        return <div ref={this.tab}
        key={this.props.viewName+'tab'}
        style={styling}                             ////v--- this
        onClick={(e)=>this.props.changeView(this.props.viewName,e.target.style.backgroundColor)}>
            <span 
            style={this.xstyle}
            onClick={e=>this.props.closeNavTab(e,null,this.props.viewName)}
            >x</span>
            {text}
        </div>
    };
}