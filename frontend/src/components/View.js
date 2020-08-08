import React, { Component } from 'react'
import Task from './Task'
import ViewButton from './ViewButton'
import ViewButton_s from './ViewButton(sidebar)'

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
            buttonUI : {rename: false, colour: {palette : false, button : false}, check: false, delete : false, description : true},
            description : {showing : false, task : 1, content : 'description', modified : false}
        }
    }


    taskComplete = () => {
        var tasks =  JSON.parse(JSON.stringify(this.state.tasks))
        var idArr = []
        var status
        for (let i in tasks){
            if (tasks[i].selected){
                status = !tasks[i].completed
                tasks[i].completed=!tasks[i].completed
                idArr.push(tasks[i].id)
            }
        }
        var set = (tasks) => {
            this.setState({
                tasks : tasks
            })    
        }
        this.props.update({idArr : idArr, completed : status},()=>{set(tasks)},'tasks/'+this.props.listId)
    }
    taskColour = e => {
        var tasks = JSON.parse(JSON.stringify(this.state.tasks))
        var idArr = []
        var colour = e.target.style.backgroundColor
        for (let i in tasks){
            if (tasks[i].selected){
                idArr.push(tasks[i].id)
                tasks[i].colour=e.target.style.backgroundColor
            }
        }
        var set = (tasks) => {
            this.setState({
                tasks : tasks
            })    
        }
        this.props.update({idArr : idArr, colour : colour},()=>{set(tasks)},'tasks/'+this.props.listId)
    }
    taskRename = (e, newname) => {
        if(newname){
            var tasks =  JSON.parse(JSON.stringify(this.state.tasks))
            for (let i in tasks){
                if (tasks[i].selected){
                    tasks[i].name=newname
                    var idArr=[tasks[i].id]
                    break
                }
            }
            var set = (tasks) => {
                this.setState({
                    tasks : tasks
                })    
            }
            this.props.update({idArr : idArr, taskName : newname},()=>{set(tasks)},'tasks/'+this.props.listId)
        } else {
            var buttonUI =  JSON.parse(JSON.stringify(this.state.buttonUI))
            var description = JSON.parse(JSON.stringify(this.state.description))
            buttonUI.rename = !buttonUI.rename
            description.showing = false
            this.setState({
                buttonUI : buttonUI,
                description : description
            })
        }
    }
    inputHandle = e => {
        this.setState({
            input : e.target.value
        })
    }
    selectTask = (e,priority) => {
        e.stopPropagation()
        var tasks =     JSON.parse(JSON.stringify(this.state.tasks))
        var buttonUI =  JSON.parse(JSON.stringify(this.state.buttonUI))
        if (tasks[priority].selected){
            var count = this.state.checkBox-1
        } else {
            var count = this.state.checkBox+1
        }
        if (count>1){
            var removeTag = true
        }
        if (count>=1){
            var del = true
            var colour = true 
            var check = true
        }
        var rename = removeTag ? false : this.state.buttonUI.rename
        tasks[priority].selected = !tasks[priority].selected
        var firstCheck = true
        for (let i in tasks){
            if (tasks[i].selected){
                if (firstCheck) {
                    var first = tasks[i].completed
                    firstCheck = false
                } else {
                    if (tasks[i].completed!=first){
                        var check = false
                        break
                    }
                }
            }
        } 
        if (count == 0) {
            rename = check = del = false 
        }
        buttonUI = {
            rename: rename, 
            colour: this.state.buttonUI.colour, 
            check: check, 
            delete : del,
            description : this.state.buttonUI.description
        }
        this.setState({
            tasks : tasks,
            checkBox : count,
            buttonUI : buttonUI
        })
    }
    setMouse = e => {
        if(this.props.activeView == this.props.className && this.state.dragging){
            this.setState({
                mouse : {x : e.clientX, y : e.clientY}
            },()=>{
                if (this.state.draggedOver){
                    var draggedOver = this.state.draggedOver.priority
                    var dragging = this.state.dragging.priority
                    var tasks= JSON.parse(JSON.stringify(this.state.tasks))
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
    dragStart = (e,priority,name) => {
        this.setState ({
            dragging : {priority,name},
            mouse : {x : e.clientX, y : e.clientY}
        })
    }
    mouseUpFix = e =>{
        e.stopPropagation()
        if(this.state.dragging){
            this.setState({
                dragging : null,
                draggedOver : null,
                mouse : 0
            }) 
        }
    }
    drop = () => {
        if(!this.state.dragging){
            this.closeOptions()
        } else {
            this.setState({
                dragging : null,
                draggedOver : null,
                mouse : 0
            })  
        }
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
    deleteTask = ()=> {
        var taskIds = []
        var taskKeys = []
        var tasks =  JSON.parse(JSON.stringify(this.state.tasks))
        var description = JSON.parse(JSON.stringify(this.state.description))
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
                        if(i == this.state.description.task.priority){
                            description = {showing : false, task : 1, content : 'description', modified : false}
                        }
                        delete tasks[i]
                    }
                    this.setState({
                        tasks: tasks,
                        description: description
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
                    tasks : { ...this.state.tasks, [response.priority] : {id : response.id, colour : response.colour, description : '', selected : false, name : response.taskName}},
                    input : ''
                })
            }
        }
        var priority=0
        if (this.state.tasks['0']){
            priority=parseInt(Object.keys(this.state.tasks).slice(-1)[0])+1
        }
        xhr.send(JSON.stringify({listId : this.props.listId, taskName : this.state.input, priority : priority}))
    }
    colourPalette = () => {
        var buttonUI =  JSON.parse(JSON.stringify(this.state.buttonUI))
        var description = JSON.parse(JSON.stringify(this.state.description))
        description.showing = false
            buttonUI.colour.palette = !buttonUI.colour.palette
            this.setState({
                buttonUI : buttonUI,
                description : description
            })
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
                            colour : task.colour, 
                            description : task.description, 
                            selected : false, 
                            name : task.taskName,
                            completed : task.completed
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
    openDescription = (e,priority) =>{
        if(this.state.description.showing && priority == this.state.description.task.priority){
            this.closeDescription()
            return
        }
        var task = JSON.parse(JSON.stringify(this.state.tasks[priority]))
        var buttonUI = JSON.parse(JSON.stringify(this.state.buttonUI))
        buttonUI.description = true
        buttonUI.rename = false
        buttonUI.colour.palette = false
        task.priority = priority
        var description = {
            showing : true,
            task : task,
            content : task.description,
            modified : false
        }
        this.setState({
            buttonUI : buttonUI,
            description : description
        })
    }
    closeDescription = () => {
        var description = JSON.parse(JSON.stringify(this.state.description))
        var buttonUI = JSON.parse(JSON.stringify(this.state.buttonUI))
        buttonUI.description = true
        description.showing = false
        description.modified = false
        description.content = description.task.description
        this.setState({
            buttonUI : buttonUI,
            description : description
        })
    }
    editDescription = e =>{
        var buttonUI = JSON.parse(JSON.stringify(this.state.buttonUI))
        buttonUI.description = !buttonUI.description
        this.setState({
            buttonUI : buttonUI
        })
    }
    saveNewDescription = e =>{
        var description = JSON.parse(JSON.stringify(this.state.description))
        var buttonUI = JSON.parse(JSON.stringify(this.state.buttonUI))
        var tasks = JSON.parse(JSON.stringify(this.state.tasks))
        var idArr = [description.task.id]
        description.modified = false
        buttonUI.description = !buttonUI.description
        tasks[description.task.priority].description=description.content
        var set = (tasks,buttonUI,description) => {
            this.setState({
                tasks : tasks,
                buttonUI : buttonUI,
                description : description
            })
        }
        this.props.update({idArr : idArr, description : description.content},()=>{set(tasks,buttonUI,description)},'tasks/'+this.props.listId)
    }
    changeDescription = e =>{
        var description = JSON.parse(JSON.stringify(this.state.description))
        description.content = e.target.value
        description.modified = true
        this.setState({
            description : description
        })
    }
    closeOptions = e =>{
        var buttonUI = JSON.parse(JSON.stringify(this.state.buttonUI))
        var description = JSON.parse(JSON.stringify(this.state.description))
        buttonUI.rename = false
        buttonUI.colour.palette = false
        description.showing = false
        this.setState({
            buttonUI : buttonUI,
            description : description
        })
    }
    inputStyle = {
        width:'235px',
        fontSize: '14px', 
        maxWidth: '235px', 
        maxHeight: '32px'
    }
    buttonsStyle = {
        marginLeft : '255px', 
        position : 'absolute', 
        marginTop : '10px'
    }
    ghostDiv = {
        position: 'relative', 
        height : '34px', 
        pointerEvents : 'none', 
        marginBottom:'10px'
    }
    descriptionStyle = {
        position: 'absolute',
        left: '400px',
        top:'140px',
        maxWidth:'300px',
        backgroundColor: 'rgba(255,255,255,0.5)',
        overflow:'hidden',
        //wordWrap:'break-word'
    }
    textAreaStyle = {
        color : 'rgba(0,0,0,1)',
        display : 'block',
        border : 'none',
        backgroundColor : 'rgba(0,0,0,0)',
        resize : 'none'
    }
    closeDescriptionStyle = {
        marginTop:'-2px',
        marginRight:'3px',
        float:'right', 
        cursor:'pointer', 
        opacity:0.3
    }
    render(){        
        var disabled = true
        if (this.state.checkBox!=1) {
                disabled = false
        }
        var styling = {margin : '50px', width: '100%', height:'90%'}
        if (this.props.activeView != this.props.className) {
            styling.display = 'none'
        } 
        var show = 'none'
        if (this.state.description.showing){
            show = 'block'
        }
        if (this.state.description.task.priority){
            var taskLabel = { backgroundColor : this.state.tasks[this.state.description.task.priority].colour}
        }
        var modified = this.state.description.modified ? <span style={{color:'red'}}>(modified)</span> : null
        var descriptionStyle = Object.assign({display : show},{...this.descriptionStyle})
        var tasks=[]
        for (let i in this.state.tasks){
            tasks.push(    
                <div key={this.state.tasks[i].name}>
                    <Task  
                        mouseUpFix={this.mouseUpFix}
                        openDescription={this.openDescription}
                        completed={this.state.tasks[i].completed}
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
            <div style={styling}
                onMouseMove={this.setMouse} 
                onMouseUp={this.drop} 
                className={this.props.className}>
                <span style={{position : 'absolute'}}> 
                    <input key="taskCreationInput" 
                        style={this.inputStyle}
                        onChange={this.inputHandle} 
                        value={this.state.input}/>
                    <button onClick={this.taskCreate}>create</button>
                </span>
                <div style={this.ghostDiv}/>
                <span style={this.buttonsStyle}>
                    <ViewButton_s symbol={'✍'} disabled={disabled} 
                        func={this.taskRename} 
                        mouseUpFix={this.mouseUpFix}
                        renameUI={this.state.buttonUI.rename}/>    
                    <ViewButton_s img={'colour.png'} 
                        checkBox={this.state.checkBox}
                        editViewColour={this.props.editViewColour} 
                        className={this.props.className}
                        func={this.colourPalette} 
                        mouseUpFix={this.mouseUpFix}
                        update={this.taskColour} 
                        updateList={this.props.updateList}
                        listId={this.props.listId}
                        disabled={true}
                        colourUI={this.state.buttonUI.colour.palette}/>
                    <ViewButton_s symbol={'✔'} 
                        func={this.taskComplete} 
                        mouseUpFix={this.mouseUpFix}
                        disabled={this.state.buttonUI.check}/> 
                    <ViewButton_s img={'delete.png'} l='7px' 
                        func={this.deleteTask} 
                        mouseUpFix={this.mouseUpFix}
                        disabled={this.state.buttonUI.delete}/> {/* need better trash icon */}
                </span>
                    {tasks}
                <div style={descriptionStyle} onClick={e=>e.stopPropagation()} onMouseUp={e=>e.stopPropagation()}>
                    <span style={taskLabel}>
                        {this.state.description.task.name}
                        <span style={this.closeDescriptionStyle} 
                            onClick={this.closeDescription}>
                            x
                        </span>
                    </span>
                    {modified}
                    <textarea value={this.state.description.content} 
                        style={this.textAreaStyle} 
                        readOnly={this.state.buttonUI.description}
                        onChange={this.changeDescription}/>           
                    <ViewButton_s symbol={'✍'} 
                        func={this.editDescription} 
                        save={this.saveNewDescription}
                        style={{float:'right', margin:'-10px'}}
                        disabled={'true'} 
                        descriptionUI={!this.state.buttonUI.description}/>
                </div>
            </div>
        )//tick, editname, delete, colour
    } 
}
/*
                <span style={{marginLeft : '255px', position : 'absolute', marginTop : '5px'}}>
                    <ViewButton_s symbol={'✔'}/> 
                    <ViewButton_s symbol={'✍'}/>    
                    <ViewButton_s img={'colour.png'}/>
                    <ViewButton_s img={'delete.png'} l='7px'/> 
                </span>
*/
/*
                <span style={{marginLeft : '5px'}}>
                    <ViewButton symbol={'✔'}/> 
                    <ViewButton symbol={'✍'}/>  
                    <ViewButton img={'delete.png'}/>  
                    <ViewButton img={'colour.png'}/> 
                </span>
*/