import React, { Component } from 'react'
import ListButtons from './ListButtons'
import ViewButton_s from './ViewButton(sidebar)'

export default class ListView extends Component {
    constructor(props){
        super(props)
        this.state = {
            lists : {},
            buttonUI : {rename: false, colour: {palette : false, button : false},delete : false},
            listsLoaded : false,
            checkBox : 0,
            input : '',
            
        }
    }
    inputHandle = e => {
        this.setState({
            input : e.target.value
        })
    }
    listColour = (e,id) => {
        var lists = JSON.parse(JSON.stringify(this.state.lists))
        var nameArr = []
        var colour = e.target.style.backgroundColor

        var updates =[]
        if(id){
            updates.push({id:id,colour:colour})
            lists[id].colour = colour
            nameArr.push(lists[id].name)
        } else {
            for (let i in lists){
                if (lists[i].selected){
                    updates.push({id:i,colour:colour})
                    lists[i].colour=colour
                    nameArr.push(lists[i].name)
                }
            }
        }
        var set = (lists) => {
            this.setState({
                lists : lists
            },()=>this.props.editViewColour(nameArr,colour))    
        }
        this.props.update(updates,()=>{set(lists)},'lists')
    }
    colourPalette = () => {
        var buttonUI =  JSON.parse(JSON.stringify(this.state.buttonUI))
            buttonUI.colour.palette = !buttonUI.colour.palette
            this.setState({
                buttonUI : buttonUI
            })
    }
    listRename = (e, newname) => {
        if(newname){
            var updates = []
            var lists =  JSON.parse(JSON.stringify(this.state.lists))
            for (let i in lists){
                if (lists[i].selected){
                    updates.push({id:i,listName:newname})
                    lists[i].name=newname
                    break
                }
            }
            var set = (lists) => {
                this.setState({
                    lists : lists
                })    
            }
            this.props.update(updates,()=>{set(lists)},'lists')
        } else {
            var buttonUI =  JSON.parse(JSON.stringify(this.state.buttonUI))
            buttonUI.rename = !buttonUI.rename
            this.setState({
                buttonUI : buttonUI,
            })
        }
    }
    listCreate = e => {
        for (let i of Object.values(this.state.lists)) {
            if (i.name==this.state.input) {return}
        }
        //if (!this.state.lists(list => list.name == value) && /\S/.test(value))
            var xhr = new XMLHttpRequest()
            xhr.open('POST','http://localhost:8000/api/lists/')
            xhr.setRequestHeader('content-type','application/json')
            xhr.setRequestHeader('X-CSRFTOKEN',document.cookie.slice(10))
            xhr.onload = () => {
                if (xhr.status == 201){
                    var response = JSON.parse(xhr.response)
                    var lists = JSON.parse(JSON.stringify(this.state.lists))
                    lists[response.id]={                            
                        name : response.listName,
                        colour : response.colour,
                        selected : false
                    }
                    this.setState({
                        lists : lists,
                        input : ''
                    })
                }
            }
            xhr.send(JSON.stringify({listName : this.state.input}))
    }
    deleteList = ()=> {
        var listIds = []
        var lists =  JSON.parse(JSON.stringify(this.state.lists))
        var buttonUI =  JSON.parse(JSON.stringify(this.state.buttonUI))
        for (let i in lists){
            if (lists[i].selected){
                listIds.push(i)
            }
        }
        var count = this.state.checkBox-listIds.length
        var state = this.selectListCheck(buttonUI,count)
        var xhr = new XMLHttpRequest()
        xhr.open('DELETE','http://localhost:8000/api/lists/')
        xhr.setRequestHeader('content-type','application/json')
        xhr.setRequestHeader('X-CSRFTOKEN',document.cookie.slice(10))
        xhr.onload = () => {
            console.log(xhr.status)
            if (xhr.status == 204){
                    for (let i of listIds){
                        this.props.closeNavTab(null,lists[i].name)
                        delete lists[i]
                    }
                    this.setState({
                        buttonUI: state.buttonUI,
                        checkBox: state.count,
                        lists: lists,
                    })
                } 
            }
        xhr.send(JSON.stringify(listIds))
    }
    selectListCheck = (buttonUI,count) => {
        var palette = this.state.buttonUI.colour.palette
        if (count>1){
            var removeTag = true
        }
        if (count>=1){
            var del = true
            var colour = true
        }
        if (count == 0) {
            palette = rename = del = false 
        }
        var rename = removeTag ? false : this.state.buttonUI.rename
        buttonUI = {
            rename: rename, 
            colour: {colour : colour, palette : palette},
            delete : del,
        }
        return{count:count,buttonUI:buttonUI}
    }
    selectList = (e,id) => {
        e.stopPropagation()
        var lists =     JSON.parse(JSON.stringify(this.state.lists))
        var buttonUI =  JSON.parse(JSON.stringify(this.state.buttonUI))
        if (lists[id].selected){
            var count = this.state.checkBox-1
        } else {
            var count = this.state.checkBox+1
        }
        
        lists[id].selected = !lists[id].selected
        var state = this.selectListCheck(buttonUI,count)
        this.setState({
            lists : lists,
            checkBox : state.count,
            buttonUI : state.buttonUI
        })
    }
    componentDidMount(){
        if (!this.state.listsLoaded) {
            let xhr = new XMLHttpRequest()
            xhr.open('GET','http://localhost:8000/api/lists/')
            xhr.setRequestHeader('content-type','application/json')
            xhr.responseType = 'json'
            xhr.onload = () => {
                if (xhr.status == 200) {
                    let lists = {}
                    xhr.response.map(list => {
                        lists[list.id]={
                            name : list.listName,
                            colour : list.colour,
                            selected : false
                        }
                    }
                )
                    this.setState({
                        lists : lists,
                        tasksLoaded : true
                    })
                }
            }
            xhr.send()
            this.props.passFunction(this.listColour)
        }
    }
    closeOptions = e =>{
        var buttonUI = JSON.parse(JSON.stringify(this.state.buttonUI))
        buttonUI.rename = false
        buttonUI.colour.palette = false
        this.setState({
            buttonUI : buttonUI,
        })
    }
    buttonsStyle = {
        left : '305px', 
        position : 'absolute', 
        marginTop : '10px',
        top : '130px'
    }
    render(){
        var disabled = true
        if (this.state.checkBox!=1) {
                disabled = false
        }
        var styling = {margin : '50px', width:'90%' , height:'90%'}
        var ref = 'none'
        if (this.props.activeView != this.props.className) {
            styling.display = 'none'
        } else {
            ref=this.props.reference
        }
        var buttons = []
        for (let i in this.state.lists){
            buttons.push(                
                <ListButtons 
                    colour={this.state.lists[i].colour}
                    selectList={this.selectList}
                    selected={this.state.lists[i].selected}
                    openNavTab={this.props.openNavTab} 
                    name={this.state.lists[i].name} 
                    id={i} 
                    />)
        }
        return (
            <div style={styling}  ref = {ref}
                onClick={this.closeOptions}
                className={this.props.className}>
                <input style={{width:'235px'}} maxLength={25} onChange={this.inputHandle} value={this.state.input}/><button onClick={this.listCreate}>create</button>
                {buttons}
                <span style={this.buttonsStyle}>
                    <ViewButton_s symbol={'✍'} disabled={disabled} 
                        func={this.listRename} 
                        renameUI={this.state.buttonUI.rename}/>    
                    <ViewButton_s img={'/static/colour.png'} 
                        listView={true}
                        checkBox={this.state.checkBox}
                        className={this.props.className}
                        func={this.colourPalette}
                        update={this.listColour}
                        disabled={this.state.buttonUI.colour.colour} 
                        colourUI={this.state.buttonUI.colour.palette}/>
                    <ViewButton_s img={'/static/delete.png'} l='7px' 
                        func={this.deleteList} 
                        disabled={this.state.buttonUI.delete}/> {/* need better trash icon */}
                </span>
            </div>
        )
    }
}
/*
update
taskColour
taskRename
deleteTask
colourPalette
closeOptions
selectTask
*/