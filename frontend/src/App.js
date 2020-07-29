import React, { Component } from 'react';
import NavBar from './components/NavBar'
import View from './components/View.js'
import ListView from './components/ListView.js'
import Registration from './components/Registration.js'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      views : [],
      colour : '#079d41',
      activeView : 'Lists',
      loggedIn : false,
      user : {}
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

  changeView = (className, colourCode) => {
    //this worked for some reason -> this.state.activeView = e.target.id
    this.setState({
      activeView : className,
      colour : colourCode
    })
  }

  editViewColour = (className, colourCode) => {
    let tabs = []
    for(let i of this.state.views){
      if(i.className == className){
        tabs.push({className : className, colourCode : colourCode, listId : i.listId})
      } else {
        tabs.push(i)
      }
    }
    this.setState({
      views : tabs
    })
  }

  openNavTab = (name, colourCode, listId) => {
    //prevents duplicates
    console.log(colourCode)
    if (this.state.views.some(view => view.className == name)){
      return
    }
    this.setState({
        views : [ ...this.state.views, {className: name, colourCode: colourCode, listId : listId}]
    })
  }

  closeNavTab = e => {
    e.stopPropagation()
    var tabs=[]
    var className = e.target.parentNode.className
    for (let i of this.state.views){
      if (i.className != className){
        tabs.push(i)
      }
    }
    this.setState ({
      views: tabs
    },() =>{
      if(!this.state.views.length){
        this.changeView('Lists','#079d41')
      } else {      
        let view = this.state.views.slice(-1)[0]
        this.changeView(view.className,view.colourCode)
        //this is annoying if you have another tab open that you are not closing. come back to this.
      } 
    })
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
      for (let i of this.state.views){
        views.push(
        <View 
        key={i.className}
        listId={i.listId}
        className={i.className} 
        activeView={this.state.activeView}/>
        )
      }
      var show = [<NavBar views={this.state.views} 
        closeNavTab={this.closeNavTab} 
        changeView={this.changeView}
        activeView={this.state.activeView}/>,
    
        <div id='views'>
          <ListView className='Lists'
          openNavTab={this.openNavTab} 
          editViewColour={this.editViewColour} 
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