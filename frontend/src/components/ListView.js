import React, { Component } from 'react'
import ListButtons from './ListButtons'

export default class ListView extends Component {
    constructor(props){
        super(props)
        this.state = {
            lists : [],
            listsLoaded : false
        }
    }

    listCreate = e => {
        var value = e.target.parentNode.children[0].value
        if (!this.state.lists.some(list => list.name == value) && /\S/.test(value)){
            var xhr = new XMLHttpRequest()
            xhr.open('POST','http://localhost:8000/api/lists/')
            xhr.setRequestHeader('content-type','application/json')
            xhr.setRequestHeader('X-CSRFTOKEN',document.cookie.slice(10))
            xhr.onload = () => {
                if (xhr.status == 201){
                    var response = JSON.parse(xhr.response)
                    this.setState({
                        lists : [ ...this.state.lists, {name : response.listName, listId : response.id}]
                    })
                }
            }
            e.target.parentNode.children[0].value = ""
            xhr.send(JSON.stringify({listName : value, userid:1}))
        }
    }

    componentDidMount(){
        if (!this.state.listsLoaded) {
            let xhr = new XMLHttpRequest()
            xhr.open('GET','http://localhost:8000/api/lists/')
            xhr.setRequestHeader('content-type','application/json')
            xhr.responseType = 'json'
            xhr.onload = () => {
                if (xhr.status == 200) {
                    let lists = []
                    xhr.response.map(list => {
                        lists.push(
                            {
                                name : list.listName,
                                listId : list.id
                            }
                        )
                    })
                    this.setState({
                        lists : lists,
                        tasksLoaded : true
                    })
                }
            }
            xhr.send()
        }
    }

    render(){
        var styling = {margin : '50px'}
        if (this.props.activeView != this.props.className) {
            styling.display = 'none'
        } 
        var buttons = []
        for (let i of this.state.lists){
            buttons.push(                
                <ListButtons 
                openNavTab={this.props.openNavTab} 
                list={i} 
                editViewColour={this.props.editViewColour}
                />)
        }
        return (
            <div style={styling} className={this.props.className}>
                <input /><button onClick={this.listCreate}>create</button>
                {buttons}

            </div>
        )
    }
}