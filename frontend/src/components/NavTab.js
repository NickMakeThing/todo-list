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
        if (this.props.activeView != this.props.className) {
            styling.filter = 'brightness(95%)' 
        }
        if (this.props.className.length > 7){
            var text = this.props.className.slice(0,5)+'...'
        } else {
            var text = this.props.className
        }

        return <div ref={this.tab}
        key={this.props.className+'tab'}
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