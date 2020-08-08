import React, { Component } from 'react';
import NavBar from './components/NavBar'
import View from './components/View.js'
import ListView from './components/ListView.js'
import Registration from './components/Registration.js'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      views : {},
      colour : '#079d41',
      activeView : 'Lists',
      loggedIn : false,
      user : {},
      func : null
    }
  }

  login = (username,password) => {
    var xhr = new XMLHttpRequest()
    xhr.open('POST','http://localhost:8000/login/')
    xhr.setRequestHeader('content-type','application/json')
    xhr.onload = () => {
      console.log(xhr.response)
      if (xhr.response == '"Success"') {
        localStorage.setItem('loggedIn', true)
        this.setState ({
          loggedIn : true
        })
      } 
      //setstate loggedin true, user {id and name?}
    }
    xhr.send(JSON.stringify({username: username, password: password}))
  }
  passFunction = func => {
    this.setState({
      func : func
    })
  }
  changeView = (name, colourCode) => {
    //this worked for some reason -> this.state.activeView = e.target.id
    this.setState({
      activeView : name,
      colour : colourCode
    })
  }

  editViewColour = (nameArr, colourCode) => {
    var views = JSON.parse(JSON.stringify(this.state.views))
    var colour = this.state.colour
    if (this.state.activeView == nameArr){
      colour = colourCode
    }
    for (let i of nameArr){
      if (views[i]){
        views[i].colourCode = colourCode
      }
    }
    this.setState({
      views : views,
      colour : colour
    })
  }

  openNavTab = (name, colourCode, listId) => {
    if (this.state.views[name]){
      return
    }
    var views = JSON.parse(JSON.stringify(this.state.views))
    views[name]={colourCode: colourCode, listId : listId}
    this.setState({
        views : views
    })
  }

  closeNavTab = e => {
    e.stopPropagation()
    var views = JSON.parse(JSON.stringify(this.state.views))
    var name = e.target.parentNode.className
    delete views[name]
    this.setState ({
      views: views
    },() =>{
      if(!this.state.views.length){
        this.changeView('Lists','#079d41')
      } else {      
        let viewKey = Object.keys(this.state.views).slice(-1)[0]
        this.changeView(viewKey,this.state.views[viewKey].colourCode)
        //this is annoying if you have another tab open that you are not closing. come back to this.
      } 
    })
  }
  update = (update,callback,path) => {
    var xhr = new XMLHttpRequest()
    xhr.open('PATCH','http://localhost:8000/api/'+path+'/')
    xhr.setRequestHeader('content-type','application/json')
    xhr.setRequestHeader('X-CSRFTOKEN',document.cookie.slice(10))
    xhr.onload = () => { console.log(xhr.status)
        if (xhr.status == 206){
            callback()
            }
        }
    xhr.send(JSON.stringify(update))
}

  componentWillMount(){
    if (!this.state.loggedIn && localStorage.getItem('loggedIn') == "true"){
      this.setState({
        loggedIn : true
      })
    }
  }
  render() {
    document.body.style.backgroundColor = this.state.colour
    if (this.state.loggedIn){
      var views=[]
      for (let i in this.state.views){
        views.push(
        <View className={i} 
        key={i}
        listId={this.state.views[i].listId}
        update={this.update}
        updateList={this.state.func} 
        activeView={this.state.activeView}/>
        )
      }
      var show = [<NavBar views={this.state.views} 
        closeNavTab={this.closeNavTab} 
        changeView={this.changeView}
        activeView={this.state.activeView}/>,
    
        <div id='views'>
          <ListView className='Lists'
            update={this.update}
            openNavTab={this.openNavTab} 
            editViewColour={this.editViewColour} 
            passFunction={this.passFunction}
            activeView={this.state.activeView}/>
          {views}
        </div>]
    } else {
      var show = <Registration login={this.login}/>
    }
    
    return ( 
      <>
        {show}
        <a onClick = {()=>localStorage.setItem('loggedIn', false)}
        href='http://localhost:8000/logout'>logout</a>
      </>
    )
  }
}

export default App;
    //https://htmlcolorcodes.com/
    //https://scriptverse.academy/tutorials/reactjs-update-array-state.html
    //https://stackoverflow.com/questions/37435334/correct-way-to-push-into-state-array
    //https://www.iconarchive.com