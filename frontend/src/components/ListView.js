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
    selectList = (e,id) => {
        e.stopPropagation()
        var lists =     JSON.parse(JSON.stringify(this.state.lists))
        var buttonUI =  JSON.parse(JSON.stringify(this.state.buttonUI))
        var count, del, colour, removeTag
        if (lists[id].selected){
            count = this.state.checkBox-1
        } else {
            count = this.state.checkBox+1
        }
        if (count>1){
            removeTag = true
        }
        if (count>=1){
            colour = del = true
        }
        var rename = removeTag ? false : this.state.buttonUI.rename
        lists[id].selected = !lists[id].selected
        var firstCheck = true
        for (let i in lists){
            if (lists[i].selected){
                if (firstCheck) {
                    var first = lists[i].completed
                    firstCheck = false
                } else {
                    if (lists[i].completed!=first){
                        var check = false
                        break
                    }
                }
            }
        } 
        var palette = this.state.buttonUI.colour.palette
        if (count == 0) {
            palette = rename = del = false 
        }
        buttonUI = {
            rename: rename, 
            colour: {colour : colour, palette : palette},
            delete : del,
        }
        this.setState({
            lists : lists,
            checkBox : count,
            buttonUI : buttonUI
        })
    }
    listColour = (e,id) => {
        var lists = JSON.parse(JSON.stringify(this.state.lists))
        var idArr = []
        var nameArr = []
        var colour = e.target.style.backgroundColor
        if(id){
            idArr.push(id)
            nameArr.push(lists[id].name)
            lists[id].colour = colour
        } else {
            for (let i in lists){
                if (lists[i].selected){
                    idArr.push(i)
                    nameArr.push(lists[i].name)
                    lists[i].colour=colour
                }
            }
        }
        var set = (lists) => {
            this.setState({
                lists : lists
            },()=>this.props.editViewColour(nameArr,colour))    
        }
        this.props.update({idArr : idArr, colour : colour},()=>{set(lists)},'lists')
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
            var lists =  JSON.parse(JSON.stringify(this.state.lists))
            for (let i in lists){
                if (lists[i].selected){
                    lists[i].name=newname
                    var idArr=[i]
                    break
                }
            }
            var set = (lists) => {
                this.setState({
                    lists : lists
                })    
            }
            this.props.update({idArr : idArr, listName : newname},()=>{set(lists)},'lists')
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
            xhr.send(JSON.stringify({listName : this.state.input, userid:1}))
    }
    deleteList = ()=> {
        var listIds = []
        var lists =  JSON.parse(JSON.stringify(this.state.lists))
        for (let i in lists){
            if (lists[i].selected){
                listIds.push(i)
            }
        }
        var xhr = new XMLHttpRequest()
        xhr.open('DELETE','http://localhost:8000/api/lists/')
        xhr.setRequestHeader('content-type','application/json')
        xhr.setRequestHeader('X-CSRFTOKEN',document.cookie.slice(10))
        xhr.onload = () => {
            console.log(xhr.status)
            if (xhr.status == 204){
                    for (let i of listIds){
                        delete lists[i]
                    }
                    this.setState({
                        lists: lists,
                    })
                } 
            }
        xhr.send(JSON.stringify(listIds))
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
        marginLeft : '255px', 
        position : 'absolute', 
        marginTop : '10px',
        top : '130px'
    }
    
    render(){
        var disabled = true
        if (this.state.checkBox!=1) {
                disabled = false
        }
        var styling = {margin : '50px', width:'100%' , height:'90%'}
        if (this.props.activeView != this.props.className) {
            styling.display = 'none'
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
            <div style={styling} 
                onClick={this.closeOptions}
                className={this.props.className}>
                <input style={{width:'235px'}}onChange={this.inputHandle} value={this.state.input}/><button onClick={this.listCreate}>create</button>
                {buttons}
                <span style={this.buttonsStyle}>
                    <ViewButton_s symbol={'✍'} disabled={disabled} 
                        func={this.listRename} 
                        renameUI={this.state.buttonUI.rename}/>    
                    <ViewButton_s img={'colour.png'} 
                        listView={true}
                        checkBox={this.state.checkBox}
                        className={this.props.className}
                        func={this.colourPalette}
                        update={this.listColour}
                        disabled={this.state.buttonUI.colour.colour} 
                        colourUI={this.state.buttonUI.colour.palette}/>
                    <ViewButton_s img={'delete.png'} l='7px' 
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