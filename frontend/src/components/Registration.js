import React, {Component} from 'react'

export default class Registration extends Component {
    constructor(props){
        super(props)
            this.state = {
                view : 'login',
                loginUser : '',
                loginPass : '',
                registerUser : '',
                registerPass : '',
                registerPass2 : ''
            }
    }
    register = () => { //password 2(confirm password) 3rd arg
        var xhr = new XMLHttpRequest()
        xhr.open('POST','http://localhost:8000/register/')
        xhr.setRequestHeader('content-type','application/json')
        xhr.onload = () => {console.log('loaded: ',xhr.response, xhr.status)}
        console.log(this.state.registerUser,this.state.registerPass)
        xhr.send(JSON.stringify({username: this.state.registerUser, password: this.state.registerPass}))
      }
    
    loginUserHandle = e => {
        this.setState({
            loginUser : e.target.value
        },console.log(this.state.loginUser))      
    }

    loginPassHandle = e => {
        this.setState({
            loginPass : e.target.value
        })
    }

    registerUserHandle = e => {
        this.setState({
            registerUser : e.target.value
        })
    }

    registerPassHandle = e => {
        this.setState({
            registerPass : e.target.value
        })
    }

    registerPass2Handle = e => {
        this.setState({
            registerPass2 : e.target.value
        })
    }

    tabClick = e => {
        if (e.target.innerText != this.state.view){
            this.setState({
                view : e.target.innerText,
            })
        }
    }
    container = {
        color: 'white',
        display:'grid',
        position : 'absolute',
        alignItems : 'center',
        justifyItems : 'center',
        //gridRowGap : '5px',
        //gridTemplateColumns : '30%, 70%',
        margin : '0 auto',
        top: '50%',
        left:'50%',
        marginTop : '-100px',
        marginLeft : '-150px',
        backgroundColor : '#676768',
        border : '20px solid #676768',
        borderRadius : '20px',
        width : '300px',
        height : '200px',
    }
    nav = {
        mixBlendMode: 'screen',
        fontSize : '80%',
        display : 'grid',
        gridTemplateColumns : '50% 50%',
        textAlign : 'center',
        position : 'absolute',
        top : -20,
        width : '340px',
        height : '10px',
        //backgroundColor : 'rgba(255,255,255,0.5)',
        //borderBottomColor : 'black',
        //borderRadius : '20px',
    }
    inactiveTab = {
        cursor : 'pointer',
        backgroundColor : 'rgba(255,255,255,0.1)',
        paddingBottom : '3px'
    }
    activeTab = {
        opacity : '0.5'
    }
    render(){
        if (this.state.view == 'login') {
            var loginStyle = this.activeTab
            var registerStyle = this.inactiveTab
            var view = <>
                Username<input key='logUser' onChange={this.loginUserHandle}/>
                Password<input key='logPass' onChange={this.loginPassHandle} type={'password'}/>
                <button onClick={() => this.props.login(this.state.loginUser,this.state.loginPass)}>login</button>
            </>
        } else {
            var loginStyle = this.inactiveTab
            var registerStyle = this.activeTab 
            var view =  <>
                Username<input key='regUser' onChange={this.registerUserHandle}/>
                Password<input key='regPass' onChange={this.registerPassHandle} type={'password'}/>
                Confirm Password<input key='regPass2' onChange={this.registerPass2Handle} type={'password'}/>
                <button onClick={this.register}>create</button>
            </>
        }
        return(
            <div style={this.container}>
                <div style={this.nav}>
                    <span onClick={this.tabClick} style={registerStyle}>register</span>
                    <span onClick={this.tabClick} style={loginStyle}>login</span>
                </div>
                {view}
            </div>
        )
    }
}