import React, { Component } from 'react'
import CheckBox from './CheckBox'

export default class ListButtons extends Component {
    constructor(props) {
        super(props)
    }

    styling = {
        cursor : 'pointer',
        display : 'block',
        position : 'relative',
        marginTop : '20px',
        userSelect: 'none',
        width : '250px',
        height : '50px',
        textAlign : 'center',
    }

    render() {
        var check = this.props.selected ? '✔' : ''      
        var styling = Object.assign({backgroundColor : this.props.colour},{...this.styling})
        return (
            <div style={styling} 
                onClick={(e)=>this.props.openNavTab(this.props.name,this.props.colour,this.props.id)}>
                <CheckBox
                    position={'absolute'}
                    top={'50%'}
                    left={'15px'} 
                    priority={this.props.id}
                    preventPropogation={e=>e.stopPropagation()}
                    select={this.props.selectList}
                    check={check}/>
                <span style={{lineHeight : '50px', pointerEvents : 'none'}}>{this.props.name}</span>
            </div>
        )
    }
}
