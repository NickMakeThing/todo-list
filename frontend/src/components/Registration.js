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
                registerPass2 : '',
                inputErrors : []
            }
    }
    errorHandle(response){
        var inputErrors=[]
        for (let i in response){
            inputErrors.push({[i]:response[i]})
        }
        this.setState({
            inputErrors:inputErrors
        })
    }
    register = e => { //password 2(confirm password) 3rd arg
        if(this.state.registerPass == this.state.registerPass2){
            var xhr = new XMLHttpRequest()
            xhr.open('POST','http://localhost:8000/register/')
            xhr.setRequestHeader('content-type','application/json')
            xhr.onload = () => {
                console.log('response:',xhr.response,'status:',xhr.status)
                this.errorHandle(JSON.parse(xhr.response))
                //blank username
                //blank password
                //blank password2
                //password length and complexity??
                //if passwords dont match
                //if username taken
            }
            xhr.send(JSON.stringify({username: this.state.registerUser, password: this.state.registerPass, password2: this.state.registerPass2}))
        } else {
            //notify they dont match. also check on backend
        }
    }
    loginUserHandle = e => {
        e.target.style.borderColor = 'none'
        this.setState({
            loginUser : e.target.value
        },console.log(this.state.loginUser))      
    }
    loginPassHandle = e => {
        e.target.style.borderColor = 'none'
        this.setState({
            loginPass : e.target.value
        })
    }
    registerUserHandle = e => {
        e.target.style.borderColor = 'none'
        this.setState({
            registerUser : e.target.value
        })
    }
    registerPassHandle = e => {
        e.target.style.borderColor = 'none'
        this.setState({
            registerPass : e.target.value
        })
    }
    registerPass2Handle = e => {
        e.target.style.borderColor = 'none'
        this.setState({
            registerPass2 : e.target.value
        })
    }
    tabClick = e => {
        if (e.target.innerText != this.state.view){
            this.setState({
                view : e.target.innerText,
                inputErrors : []
            })
        }
    }
    container = {
        color: 'white',
        display:'grid',
        position : 'absolute',
        alignItems : 'center',
        justifyItems : 'center',

        margin : '0 auto',
        top: '50%',
        left:'50%',
        transform: 'translateY(-50%) translateX(-50%) scale(125%)',
        backgroundColor : '#676768',
        border : '20px solid #676768',
        borderBottomLeftRadius : '20px',
        borderBottomRightRadius : '20px',
        width : '300px',
        height : '200px',
    }
    nav = {
        fontSize : '80%',
        display : 'grid',
        gridTemplateColumns : '50% 50%',
        textAlign : 'center',
        position : 'absolute',
        borderTopRightRadius : '20px',
        borderTopLeftRadius : '20px',
        top : -35,
        width : '340px',
        height : '25px',
        backgroundColor :  '#676768',
        overflow:'hidden'
    }
    loginTab = {
        lineHeight : '25px',
    }
    registerTab = {
        lineHeight : '25px',
    }    //stylecomponents
    render(){
        var userInputStyle = {boxShadow : 'none'}
        var passInputStyle = {boxShadow : 'none'}
        for (let i of this.state.inputErrors){
            if (i['username']){
                userInputStyle['boxShadow'] = '0px 0px 5px rgba(255,0,0,0.9)'
                continue
            }
            if (i['password']){
                passInputStyle['boxShadow'] = '0px 0px 5px rgba(255,0,0,0.9)'
            }
        }
        if (this.state.view == 'login') {
            var loginStyle = this.loginTab
            var registerStyle = Object.assign({
                backgroundColor : 'rgba(255,255,255,0.1)', 
                cursor : 'pointer'
            },{...this.registerTab})

            var view = <>
                Username<input key='logUser' style={userInputStyle} onChange={this.loginUserHandle}/>
                Password<input key='logPass' style={passInputStyle} onChange={this.loginPassHandle} type={'password'}/>
                <button onClick={() => this.props.login(this.state.loginUser,this.state.loginPass,response=>this.errorHandle(response))}>login</button>
            </>
        } else {
            var loginStyle = Object.assign({
                backgroundColor : 'rgba(255,255,255,0.1)', 
                cursor : 'pointer'
            },{...this.loginTab})
            var registerStyle = this.registerTab 

            var view =  <>
                Username<input key='regUser' style={userInputStyle} onChange={this.registerUserHandle}/>
                Password<input key='regPass' style={passInputStyle} onChange={this.registerPassHandle} type={'password'}/>
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