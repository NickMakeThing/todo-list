import React, { Component } from 'react';
import NavBar from './components/NavBar'
import View from './components/View.js'
import ListView from './components/ListView.js'
import Registration from './components/Registration.js'
import Cookies from 'js-cookie'
class App extends Component {
  constructor(props){
    super(props)
    this.activeViewContainer = React.createRef()
    this.state = {
      views : {},
      colour : '#079d41',
      activeView : 'Lists',
      loggedIn : false,
      user : {},
      func : null,
    }
  }
  deleteView = (oldname) => {
    var views = JSON.parse(JSON.stringify(this.state.views))
    if (this.state.views[oldname]){ //using var declared above causes crash here
      var open=true
    }
    delete views[oldname]
    this.setState({
      views : views
    })
    return open
  }
  login = (username,password,callback) => {
    var xhr = new XMLHttpRequest()
    xhr.open('POST','/login/')
    xhr.setRequestHeader('content-type','application/json')
    xhr.setRequestHeader('X-CSRFTOKEN',Cookies.get('csrftoken'))
    xhr.onload = () => {
      if (xhr.response == '"Success"') {
        localStorage.setItem('loggedIn', true)
        this.setState ({
          loggedIn : true
        })
      } else {
        callback(JSON.parse(xhr.response))
      } 
    }
    xhr.send(JSON.stringify({username: username, password: password}))
  }
  passFunction = func => {
    this.setState({
      func : func
    })
  }
  failSafe = (ref) => {
    if(ref.current){
      if(this.state.activeView == 'Lists'){
        ref.current.click()
      } else {
        var mouseUp = document.createEvent('MouseEvents')
        mouseUp.initEvent('mouseup',true,true)
        ref.current.dispatchEvent(mouseUp)
      }
    }
  }

  changeView = (name, colourCode) => {
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

  closeNavTab = (e,list,tabname) => {
    if(e){
      e.stopPropagation()
      var name = tabname
    } else {
      var name=list
    }
    var views = JSON.parse(JSON.stringify(this.state.views))
    if (views[name]){
      delete views[name]
      this.setState ({
        views: views
      },() =>{
        if(!this.state.views.length){
          this.changeView('Lists','#079d41')
        } else {      
          let viewKey = Object.keys(this.state.views).slice(-1)[0]
          this.changeView(viewKey,this.state.views[viewKey].colourCode)
        } 
      })
    }
  }
  update = (update,callback,path) => {
    var xhr = new XMLHttpRequest()
    xhr.open('PATCH','/api/'+path+'/')
    xhr.setRequestHeader('content-type','application/json')
    xhr.setRequestHeader('X-CSRFTOKEN',Cookies.get('csrftoken'))
    xhr.onload = () => { 
        if (xhr.status == 206){
            callback()
            }
        }
    xhr.send(JSON.stringify(update))
}

  componentWillMount(){
    document.documentElement.style.height = '100%'
    document.body.style.height = '100%'
    document.getElementById('root').style.height='90%'
    if (!this.state.loggedIn && localStorage.getItem('loggedIn') == "true"){
      this.setState({
        loggedIn : true
      })
    }
  }
  render() {
    document.body.style.backgroundColor = this.state.colour
    if (this.state.loggedIn){
      var logout = <a style={{color:'black'}}
        onClick = {()=>localStorage.setItem('loggedIn', false)}
        href='/logout'>logout</a>
      var views=[]
      for (let i in this.state.views){
        views.push(
        <View viewName={i} 
          key={i}
          reference={this.activeViewContainer}
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
    
        <div style={{minHeight:'90%'}} id='views'
          onClick={()=>this.failSafe(this.activeViewContainer)}>
          <ListView viewName='Lists'
            deleteView={this.deleteView}
            reference={this.activeViewContainer}
            update={this.update}
            closeNavTab={this.closeNavTab}
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
        {logout}
      </>
    )
  }
}

export default App;


