import React, {Component} from 'react'

export default class Input extends Component {
    constructor(props){
        super(props)
        this.state = {
            selectIndexes: {},
            focus : false,
            value : ''
        }
    }

    changeHandle = e => {
        this.setState({
            value : e.target.value
        })
    }
    focusHandle = e => {
        e.target.parentNode.children[1].focus()//replace with componentdidupdate refs
        this.setState({
            focus : true
        })
    }
    focusOutHandle = e => {
        this.setState({
            focus : false
        })
    }

    selection={
        backgroundColor : 'yellow'
    }
    style={ //focus #4a90d9 //grey b6b6b3
        //display : 'inline-block',
        lineHeight : '32px',
        border : 'solid 1px #b6b6b3',
        borderRadius : '3px',
        //padding: '1px',
        paddingRight : '8px',
        paddingLeft : '8px',
        backgroundColor : 'white',
        width : '235px',
        height : '32px'
    }
    
    render(){
        var style = {...this.style}
        if (this.state.focus){
            style.border = 'solid 2px #4a90d9'
            style.paddingRight = '7px'
            style.paddingLeft = '7px'
            style.height = '30px'
            style.lineHeight = '30px'
        }

        return(
            <div>
                <div contenteditable="true" 
                    style={style} 
                    
                    onClick={this.focusHandle}>
                        {this.state.value}
                </div>
                <input
                    onMouseUp={this.selectHandle}
                    onChange={this.changeHandle}
                    onBlur={this.focusOutHandle}
                    onFocus={this.focusHandle}
                />
            </div>
        )
    }
}