import React, { Component } from 'react'
import CheckBox from './CheckBox'
export default class Options extends Component {
    constructor(props){
        super(props)
        this.state = {
            taskName : '', 
            listName : '',
            taskColour : '',
            viewColour : '',
            description : '',
            cross : false,
            preview : false,
            visible : false,
        }
    }
    optionsSelect = option => {
        if(option == 'cross'){
            this.setState({
                cross : !this.state.cross
            })
        } else if (option == 'preview') {
            this.setState({
                preview: !this.state.preview
            })
        }
    }
    taskNameHandleHandle = e => {
        this.setState({
            taskName : e.target.value
        })
    }
    taskColourHandle = e => {
        this.setState({
            taskColour : e.target.value
        })
    }
    descriptionHandle = e => {
        this.setState({
            description : e.target.value
        })
    }
    clickHandle = e => {
        if (!this.state.visible){
            e.target.style.transform = "rotate(20deg)"
        } else {
            e.target.style.transform = "none"
        }
        setTimeout(() => {  
            this.setState({
                visible : !this.state.visible
            })
         }, 300)
    }
    hover = e => {
        //e.target.style.textShadow = '0px 0px 3px white'
    }  
    hoverEnd = e => {
       // e.target.style.textShadow = 'none'
    }

    container = {
        color: 'white',
        position : 'fixed',
        //alignItems : 'center',
        //justifyItems : 'center',
        //gridRowGap : '5px',
        //gridTemplateColumns : '30%, 70%',
        margin : '0 auto',
        top: '110px',
        left:'400px',
        backgroundColor : '#079d41',
        border : '20px solid #079d41',
        borderRadius : '20px',
        width : '300px',
        height : '400px',
    }
    textarea = {
        maxWidth : '200px',
        maxHeight : '70px',
        width : '200px',
        height : '70px'
    }
    optionsButton = {//how to center rotation better?
        transition: '0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor : 'blue',
        cursor : 'pointer', //how to stop it changing position on zoom?
        fontSize : '300%',
        userSelect : 'none',
    }
    position = {
        position : 'fixed',
        top : '132px',
        left : '320px'
    }
    optionsDiv = {
        position : 'relative',
        display : 'grid',
        left : '30px',
        //marginTop : '-10px'
    }
    optionsDivSpan = {
        display : 'grid',
        gridTemplateColumns : '18% 60%'
    }
    //select all/unselect all, preview?
    //when more than one selected, clear taskname form
    //default colour?
    //cross out (make button or uncheck on certain changes)
    //select/deselect all button
    render () {
        var container = this.state.visible ? Object.assign({...this.container}, {display : 'grid'}) : Object.assign({...this.container}, {display : 'none'})
        var crossCheck = this.state.cross ? '✔' : ''
        var previewCheck = this.state.preview ? '✔' : ''
        var taskNameInput = this.props.disabled ? <input disabled onChange={this.taskNameHandleHandle} /> : <input onChange={this.taskNameHandleHandle}/> 
        return(
            <div style = {this.position}>
                <div style={this.optionsButton}
                onMouseOver={this.hover}
                onMouseLeave={this.hoverEnd}
                onClick={this.clickHandle}>
                ⚙️
                </div>
                <div style={container}>
                    Task
                    <div style={this.optionsDiv}>
                        <span style={this.optionsDivSpan}>Name {taskNameInput}</span>
                        <span style={this.optionsDivSpan}>Colour <input type='color' onChange={this.taskColourHandle}/></span>
                        <span>Description </span>
                        <span style={{width : '201px', height : '71px', position : 'relative', left : '18%'}}>
                            <textarea maxLength="250" style={this.textarea} onChange={this.descriptionHandle}/>
                        </span>
                        <span>
                            Cross/Uncross <CheckBox top={'7px'} left={'none'} check={crossCheck} position={'relative'} selectTask={() => this.optionsSelect('cross')}/>
                            <button style={{position : 'relative', left : '49px' }}onClick={this.props.deleteTask}>Delete</button>
                        </span>
                        
                    </div>
                    List
                    <div style={this.optionsDiv}>
                        <span style={this.optionsDivSpan}>Name <input /></span>
                        <span style={this.optionsDivSpan}>Colour <input type='color' /></span>
                    </div>
                    <span>Preview <CheckBox top={'7px'} left={'none'} check={previewCheck} position={'relative'} selectTask={() => this.optionsSelect('preview')}/></span>
                    <button onClick={() => this.props.submitOptions(this.state,this.props.disabled)}>Submit</button>
                </div>
            </div>
        )
    }

}