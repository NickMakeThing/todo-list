import React, { Component } from 'react'
import Task from './Task'
import Options from './Options'
import Input from './Input'

export default class View extends Component {
    constructor(props){
        super(props)
        this.state = {
            tasks : {},
            tasksLoaded : false,
            dragging : null,
            draggedOver : null,
            mouse : 0,
            input : '',
            checkBox : 0,
        }
    }

    submitOptions = (state, disabled) => {
        //state.listName state.viewColour
        console.log(state.taskColour)
        var tasks = {...this.state.tasks}
        var updates = []
        var taskName= ''
        for (let i in tasks) {
            if (tasks[i].name == state.taskName) {
                disabled = true
            }
        }
        for (let i in tasks){
            let update = {listId: 1}
            update['id']=tasks[i].id
            if (tasks[i].selected){
                if (state.taskColour){
                    tasks[i].colour = state.taskColour
                    update['colour'] = state.taskColour
                }
                if (state.description){
                    tasks[i].description = state.description
                    update['description'] = state.description
                }
                if (!disabled && state.taskName) {
                    tasks[i].name = state.taskName
                    update[taskName] = state.taskName
                }
                updates.push(update)
            }
            console.log(updates)
        var xhr = new XMLHttpRequest()
        xhr.open('PATCH','http://localhost:8000/api/tasks/'+this.props.listId+'/')
        xhr.setRequestHeader('content-type','application/json')
        xhr.setRequestHeader('X-CSRFTOKEN',document.cookie.slice(10))
        xhr.onload = () => { console.log(xhr.status)
            if (xhr.status == 206){
                    this.setState({
                        tasks : tasks
                    })
                }
            }
        }
        xhr.send(JSON.stringify(updates))  
    }

    
    inputHandle = stuff => {
        this.setState({
            input : stuff
        })
    }

    selectTask = priority => {
        var tasks = {...this.state.tasks}
        if (tasks[priority].selected){
            var count = this.state.checkBox-1
        } else {
            var count = this.state.checkBox+1
        }
        tasks[priority].selected = !tasks[priority].selected
        this.setState({
            tasks : tasks,
            checkBox : count
        })
    }

    //use refs to make this state for only the thing being dragged
    //as opposed to passing it as a prop to every instance and rerendering views a bunch
    //see if it makes cpu usage better
    setMouse = e => {
        if(this.props.activeView == this.props.className && this.state.dragging){
            this.setState({
                mouse : {x : e.clientX, y : e.clientY}
            },()=>{
                if (this.state.draggedOver){
                    var draggedOver = this.state.draggedOver.priority
                    var dragging = this.state.dragging.priority
                    var tasks={...this.state.tasks}
                    if (this.state.mouse.y < this.state.draggedOver.pos && dragging>draggedOver){
                        delete tasks[dragging]
                        tasks[draggedOver]=this.state.tasks[dragging]
                        for(let i=parseInt(draggedOver)+1; i<=dragging; i++){
                            tasks[i]=this.state.tasks[i-1]
                        }
                        this.setState({
                            tasks : tasks,
                            dragging : {priority : draggedOver, name : this.state.dragging.name}
                        })
                    } else if (this.state.mouse.y > this.state.draggedOver.pos && dragging<draggedOver){ 
                        delete tasks[dragging]
                        tasks[draggedOver]=this.state.tasks[dragging]
                        for(let i=draggedOver-1; i>=dragging; i--){
                            tasks[i]=this.state.tasks[i+1]
                        }
                        this.setState({
                            tasks : tasks,
                            dragging : {priority : draggedOver, name : this.state.dragging.name}
                        })
                    }   
                }
            })
        }
    }

    dragStart = (priority,name) => {
        this.setState ({
            dragging : {priority,name}
        })
    }

    drop = () => {
        this.setState({
            dragging : null,
            draggedOver : null,
            mouse : 0
        })  
    }

    dragOver = (e,priority) => {
        if(this.state.dragging){
            var box = e.target.getBoundingClientRect()
            var pos = box.bottom - box.height/2
            this.setState({
                draggedOver: {priority : priority, pos : pos}
            })
        }
    }
    
    deleteTask = ()=> {//make delete show on frontend too
        var taskIds = []
        var taskKeys = []
        var tasks = {...this.state.tasks}
        for (let i in tasks){
            if (tasks[i].selected){
                taskIds.push(tasks[i].id)
                taskKeys.push(i)
            }
        }
        var xhr = new XMLHttpRequest()
        xhr.open('DELETE','http://localhost:8000/api/tasks/'+this.props.listId+'/')
        xhr.setRequestHeader('content-type','application/json')
        xhr.setRequestHeader('X-CSRFTOKEN',document.cookie.slice(10))
        xhr.onload = () => {
            console.log(xhr.status)
            if (xhr.status == 204){
                    for (let i of taskKeys){
                        delete tasks[i]
                    }
                    this.setState({
                        tasks: tasks,
                    })
                } 
            }
        xhr.send(JSON.stringify(taskIds))
    } 
       
    taskCreate = () => { //remember to takeout cors middleware
        for (let i of Object.values(this.state.tasks)) {
            if (i.name==this.state.input) {return}
        }
        var xhr = new XMLHttpRequest()
        xhr.open('POST','http://localhost:8000/api/tasks/'+this.props.listId+'/')
        xhr.setRequestHeader('content-type','application/json')
        xhr.setRequestHeader('X-CSRFTOKEN',document.cookie.slice(10))
        xhr.onload = () => {
            if (xhr.status == 201){
                var response = JSON.parse(xhr.response)
                this.setState({
                    tasks : { ...this.state.tasks, [response.priority] : {id : response.id, colour : '#079d41', description : '', selected : false, name : response.taskName}},
                    input : ''
                })
            }
        }
        xhr.send(JSON.stringify({listId : this.props.listId, taskName : this.state.input, priority : parseInt(Object.keys(this.state.tasks).slice(-1)[0])+1}))
    }

    componentDidUpdate(){
        if (this.props.activeView == this.props.className && !this.state.tasksLoaded) {
            let xhr = new XMLHttpRequest()
            xhr.open('GET','http://localhost:8000/api/tasks/'+this.props.listId)
            xhr.setRequestHeader('content-type','application/json')
            xhr.responseType = 'json'
            xhr.onload = () => {
                if (xhr.status == 200) {
                    let tasks = {}
                    xhr.response.map(task => {
                        tasks[task.priority]={
                            id : task.id, 
                            colour : '#079d41', 
                            description : '', 
                            selected : false, 
                            name : task.taskName
                        }
                    })
                    this.setState({
                        tasks : tasks,
                        tasksLoaded : true,
                    })
                }
            }
            xhr.send()
        }
    }

    render(){ 
        var disabled = false
        if (this.state.checkBox>1) {
                disabled = true
        }
        var styling = {margin : '50px'}
        if (this.props.activeView != this.props.className) {
            styling.display = 'none'
        } 
        var tasks=[]
        for (let i in this.state.tasks){
            tasks.push(    
                <div key={this.state.tasks[i].name}>
                    <Task  
                        colour={this.state.tasks[i].colour}
                        selected={this.state.tasks[i].selected}
                        selectTask={this.selectTask}
                        listId={this.props.listId}
                        dragOver={this.dragOver}
                        dragging={this.state.dragging}
                        mouse={this.state.mouse}
                        deleteTask={this.deleteTask}
                        dragStart={this.dragStart}
                        name={this.state.tasks[i].name}
                        id={this.state.tasks[i].id}
                        priority={i}
                    /> 
                </div>
            ) 
        }
        return (
            //dropdown to change colour of all tasks at the same time
            //component on the right for creating task. puts it below
                //task can then be dragged to be somewhere among the rest
            //DOMRect { x: 50, y: 86, width: 253, height: 34, top: 86, right: 303, bottom: 120, left: 50 }
            <div onMouseMove={this.setMouse} onMouseUp={this.drop} className={this.props.className} style={styling}>
                <Options disabled={disabled} submitOptions={this.submitOptions} deleteTask={this.deleteTask}/>
                <span style={{position : 'absolute'}}> 
                    <input key="taskCreationInput" onChange={this.inputHandle} value={this.state.input} style={{width:'235px',fontSize: '14px', maxWidth: '235px', maxHeight: '32px'}}/>
                    <button onClick={this.taskCreate}>create</button>
                </span>
                <div style={{position: 'relative', height : '34px', pointerEvents : 'none'}}/>
                    {tasks}
            </div>
        )
    } 
}
