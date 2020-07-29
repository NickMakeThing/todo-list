var tasks = [...this.state.tasks]
let c=0
for (let i of tasks){
    if (i.name==this.state.dragging){
        var draggingIndex = c
        var dragging = tasks[draggingIndex]
    } else if (i.name==this.state.draggedOver.name){
        var overIndex = c
    }
    c++
}
//the second condition: because when the first splice happens, the index of draggedOver changes, while the value of 'overIndex' stays the same
if (this.state.mouse.y < this.state.draggedOver.pos && !(draggingIndex<overIndex)){
    tasks.splice(draggingIndex,1)
    tasks.splice(overIndex,0,dragging)
    this.setState({
        tasks : tasks
    })
} else if (this.state.mouse.y > this.state.draggedOver.pos && !(draggingIndex>overIndex)){ 
    tasks.splice(draggingIndex,1)
    tasks.splice(overIndex,0,dragging)
    this.setState({
        tasks : tasks
    })
}
 