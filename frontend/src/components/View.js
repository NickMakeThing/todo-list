import React, { Component } from 'react'
import Task from './Task'
import ViewButton_s from './ViewButton'
import Cookies from 'js-cookie'

export default class View extends Component {
    constructor(props){
        super(props)
        this.textArea=React.createRef()
        this.state = {
            tasks : {},
            tasksLoaded : false,
            dragging : null,
            draggedOver : null,
            mouse : 0,
            input : '',
            checkBox : 0, 
            buttonUI : {rename: false, colour: {palette : false, button : false}, check: false, delete : false, description : true},
            description : {showing : false, task : 1, content : 'description', modified : false},
            priorityUpdateInfo : { draggedFrom : 0, draggedTo : 0}
        }
    }
    taskComplete = () => {
        var tasks =  JSON.parse(JSON.stringify(this.state.tasks))
        var updates = []
        for (let i in tasks){
            if (tasks[i].selected){
                updates.push({id:tasks[i].id,completed:!tasks[i].completed})
                tasks[i].completed=!tasks[i].completed 
            }
        }
        var set = (tasks) => {
            this.setState({
                tasks : tasks
            })    
        }
        this.props.update(updates,()=>{set(tasks)},'tasks/'+this.props.listId)
    }
    taskColour = e => {
        var tasks = JSON.parse(JSON.stringify(this.state.tasks))
        var colour = e.target.style.backgroundColor
        var updates = []
        for (let i in tasks){
            if (tasks[i].selected){
                updates.push({id:tasks[i].id,colour:colour})
                tasks[i].colour=colour 
            }
        }
        var set = (tasks) => {
            this.setState({
                tasks : tasks
            })    
        }
        this.props.update(updates,()=>{set(tasks)},'tasks/'+this.props.listId)
    }
    taskRename = (e, newname) => {
        if(newname){
            var tasks =  JSON.parse(JSON.stringify(this.state.tasks))
            var updates = []
            for (let i in tasks){
                if (tasks[i].selected){
                    updates.push({id:tasks[i].id,taskName:newname})
                    tasks[i].name=newname
                    break
                }
            }
            var set = (tasks) => {
                this.setState({
                    tasks : tasks
                })    
            }
            this.props.update(updates,()=>{set(tasks)},'tasks/'+this.props.listId)
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
    selectTaskCheck = (tasks,buttonUI,count) => {
        if (count>1){
            var removeTag = true
        }
        if (count>=1){
            var del = true
            var check = true
        }
        var rename = removeTag ? false : this.state.buttonUI.rename
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
        return {tasks : tasks, count : count, buttonUI : buttonUI}
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
        tasks[priority].selected = !tasks[priority].selected
        var state = this.selectTaskCheck(tasks,buttonUI,count)
        this.setState({
            tasks : state.tasks,
            checkBox : state.count,
            buttonUI : state.buttonUI
        })
    }
    setMouse = e => {
        if(this.props.activeView == this.props.viewName && this.state.dragging){
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
                            dragging : {priority : draggedOver, name : this.state.dragging.name},
                            priorityUpdateInfo : {draggedFrom : this.state.priorityUpdateInfo.draggedFrom, draggedTo : draggedOver}
                        })
                    } else if (this.state.mouse.y > this.state.draggedOver.pos && dragging<draggedOver){ 
                        delete tasks[dragging]
                        tasks[draggedOver]=this.state.tasks[dragging]
                        for(let i=draggedOver-1; i>=dragging; i--){
                            tasks[i]=this.state.tasks[i+1]
                        }
                        this.setState({
                            tasks : tasks,
                            dragging : {priority : draggedOver, name : this.state.dragging.name},
                            priorityUpdateInfo : {draggedFrom : this.state.priorityUpdateInfo.draggedFrom, draggedTo : draggedOver}
                        })
                    }   
                }
            })
        }
    }
    dragStart = (e,priority,name) => {
        this.setState ({
            dragging : {priority,name},
            mouse : {x : e.clientX, y : e.clientY},
            priorityUpdateInfo : {draggedFrom : priority, draggedTo : priority}
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
    taskOrderUpdate = () => {
        var fromTo = JSON.parse(JSON.stringify(this.state.priorityUpdateInfo))
        var tasks = JSON.parse(JSON.stringify(this.state.tasks))
        if (fromTo.draggedFrom==fromTo.draggedTo) {
            return
        }
        var higher = Math.max(fromTo.draggedFrom,fromTo.draggedTo)
        var lower = Math.min(fromTo.draggedFrom,fromTo.draggedTo)
        var updates = []
        for (let i=lower;i<=higher;i++){
            updates.push({id:tasks[i].id,priority:i})
        }
        this.props.update(updates,()=>null,'tasks/'+this.props.listId)
    }
    drop = e => {
        if(!this.state.dragging){
            this.closeOptions()
        } else {
            this.taskOrderUpdate()
            this.setState({
                dragging : null,
                draggedOver : null,
                mouse : 0,
                priorityUpdateInfo : { draggedFrom : 0, draggedTo : 0}
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
    fixPriority = tasks => {
        var count = 0
        var priority = {} 
        var idArr = []
        for(let i in tasks){
            if (i!=count){
                tasks[count]=tasks[i]
                delete tasks[i]
                idArr.push(tasks[count].id)
                priority[tasks[count].id]=count
            }
            count++
        }
        return { tasks : tasks, idArr : idArr, priority: priority}
    }
    taskDelete = ()=> {
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
        var buttonUI =  JSON.parse(JSON.stringify(this.state.buttonUI))
        var count = this.state.checkBox-taskKeys.length
        for (let i of taskKeys){
            if(i == this.state.description.task.priority){
                description = {showing : false, task : 1, content : 'description', modified : false}
            }
            delete tasks[i]
        }
        var updated = this.fixPriority(tasks)
        tasks = updated.tasks
        var state = this.selectTaskCheck(tasks,buttonUI,count)
        var priorityUpdate = []
        for (let i in updated.priority){
            priorityUpdate.push({id:i,priority:updated.priority[i]})
        }
        var xhr = new XMLHttpRequest()
        xhr.open('DELETE','/api/tasks/'+this.props.listId+'/')
        xhr.setRequestHeader('content-type','application/json')
        xhr.setRequestHeader('X-CSRFTOKEN',Cookies.get('csrftoken'))
        xhr.onload = () => {
            if (xhr.status == 204){
                this.setState({
                    tasks: state.tasks,
                    checkBox: state.count,
                    buttonUI: state.buttonUI,
                    description: description
                })
            } 
        }
        xhr.send(JSON.stringify({delete:taskIds, update:priorityUpdate}))
    } 
    taskCreate = () => { //remember to takeout cors middleware
        for (let i of Object.values(this.state.tasks)) {
            if (i.name==this.state.input) {return}
        }
        var xhr = new XMLHttpRequest()
        xhr.open('POST','/api/tasks/'+this.props.listId+'/')
        xhr.setRequestHeader('content-type','application/json')
        xhr.setRequestHeader('X-CSRFTOKEN',Cookies.get('csrftoken'))
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
            priority=parseInt(Object.keys(this.state.tasks).slice(-1)[0])+1//pop
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
        this.textArea.current.focus()
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
        var update = [{
            id:description.task.id,
            description:description.content
        }]
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
        this.props.update(update,()=>{set(tasks,buttonUI,description)},'tasks/'+this.props.listId)
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
    componentDidUpdate(){
        if (this.props.activeView == this.props.viewName && !this.state.tasksLoaded) {
            let xhr = new XMLHttpRequest()
            xhr.open('GET','/api/tasks/'+this.props.listId)
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
    inputStyle = {
        width:'235px',
        webkitLogicalWidth : '242px',
        fontSize: '14px', 
    }
    buttonsStyle = {
        marginLeft : '255px', 
        position : 'absolute', 
        marginTop : '10px'
    }
    ghostDiv = {
        position: 'relative', 
        height : '34px', 
        webkitLogicalHeight : '22px',
        pointerEvents : 'none', 
        marginBottom:'10px'
    }
    descriptionContainer = {
        position: 'absolute',
        left: '400px',
        top:'140px', 
        height:'100%'
    }
    descriptionStyle = {
        position:'sticky',
        top:0,
        left:0,
        width:210,
        height : '160px',
        backgroundColor: 'rgba(255,255,255,0.5)',
        overflow:'hidden',
        wordWrap:'break-word'
    }
    textAreaStyle = {
        color : 'rgba(0,0,0,1)',
        display : 'block',
        border : 'none',
        backgroundColor : 'rgba(0,0,0,0)',
        resize : 'none',
        outline : 'none',
        height : 55
    }
    closeDescriptionStyle = {
        poisition: 'absolute',
        top:0,
        float:'right', 
        marginTop:'-2px',
        marginRight:'3px',
        marginLeft:'3px',
        cursor:'pointer', 
        opacity:0.3
    }
    render(){ 
        var disabled = true
        if (this.state.checkBox!=1) {
                disabled = false
        }
        var styling = {margin : '50px', width: '90%', height:'90%'}
        var ref = 'none'
        if (this.props.activeView != this.props.viewName) {
            styling.display = 'none'
        } else {
            ref=this.props.reference
        }
        var show = 'none'
        if (this.state.description.showing){
            show = 'block'
        }
        if (this.state.description.task.priority){
            var taskLabel = { 
                backgroundColor : this.state.description.task.colour,
            }
        }
        var descriptionStyle = Object.assign({display : show},{...this.descriptionStyle})
        var modified = this.state.description.modified ? <span style={{color:'red'}}>(modified)</span> : null
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
                        dragStart={this.dragStart}
                        name={this.state.tasks[i].name}
                        id={this.state.tasks[i].id}
                        priority={i}
                    /> 
                </div>
            ) 
        }
        return (
            <div style={styling} ref={ref}
                onMouseMove={this.setMouse} 
                onClick={e=>e.stopPropagation()}
                onMouseUp={this.drop} >
                <span style={{position : 'absolute'}}> 
                    <input key="taskCreationInput" 
                        maxLength={40}
                        style={this.inputStyle}
                        onChange={this.inputHandle} 
                        value={this.state.input}/>
                    <button onClick={this.taskCreate}>create</button>
                </span>
                <div style={this.ghostDiv}/>
                <span style={this.buttonsStyle}>
                    <ViewButton_s symbol={'✔'} 
                        func={this.taskComplete} 
                        mouseUpFix={this.mouseUpFix}
                        disabled={this.state.buttonUI.check}/> 
                    <ViewButton_s img={'/static/colour.png'} 
                        checkBox={this.state.checkBox}
                        editViewColour={this.props.editViewColour} 
                        func={this.colourPalette} 
                        mouseUpFix={this.mouseUpFix}
                        update={this.taskColour} 
                        updateList={this.props.updateList}
                        listId={this.props.listId}
                        disabled={true}
                        colourUI={this.state.buttonUI.colour.palette}/>
                    <ViewButton_s img={'/static/delete.png'} l='7px' 
                        func={this.taskDelete} 
                        mouseUpFix={this.mouseUpFix}
                        disabled={this.state.buttonUI.delete}/> {/* need better trash icon */}
                    <ViewButton_s symbol={'✎'} disabled={disabled} 
                        func={this.taskRename} 
                        mouseUpFix={this.mouseUpFix}
                        renameUI={this.state.buttonUI.rename}/>    
                </span>
                    {tasks}
                <span style={this.descriptionContainer}>    
                    <div style={descriptionStyle} onClick={e=>e.stopPropagation()} onMouseUp={e=>e.stopPropagation()}>
                        <span style={this.closeDescriptionStyle} 
                            onClick={this.closeDescription}>
                            x
                        </span>
                        <div style={{maxWidth:195}}>
                            <span style={taskLabel}>
                                {this.state.description.task.name}
                            </span>
                        </div>
                        {modified}
                        <textarea value={this.state.description.content} 
                            maxLength={250}
                            ref={this.textArea}
                            style={this.textAreaStyle} 
                            readOnly={this.state.buttonUI.description}
                            onChange={this.changeDescription}/>           
                        <ViewButton_s symbol={'✎'} 
                            func={this.editDescription} 
                            save={this.saveNewDescription}
                            style={{
                                float:'right', 
                                margin:'-10px', 
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                            }}
                            disabled={'true'} 
                            descriptionUI={!this.state.buttonUI.description}/>
                    </div>
                </span>
            </div>
        )//tick, editname, delete, colour
    } 
}
