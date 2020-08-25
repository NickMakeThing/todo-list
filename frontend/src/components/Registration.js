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
    frontEndRegisterCheck(){
        var inputErrors=[]
        var state = this.state
        if (state.registerUser == ''){
            inputErrors.push({username:'This field should not be empty'})
        }
        if (state.registerPass != state.registerPass2){
            inputErrors.push({password:'Password fields do not match'})
            inputErrors.push({password2:'Password fields do not match'})
        } else {
            if (state.registerPass == ''){
                inputErrors.push({password:'This field should not be empty'})
            }
            if (state.registerPass2 == ''){
                inputErrors.push({password2:'This field should not be empty'})
            }
        }
        this.setState({
            inputErrors : inputErrors
        })
        return !inputErrors.length
    }
    frontEndLoginCheck(){
        var inputErrors=[]
        var state = this.state
        if (state.loginUser == ''){
            inputErrors.push({username:'This field should not be empty'})
        }
        if (state.loginPass == ''){
            inputErrors.push({password:'This field should not be empty'})
        }
        this.setState({
            inputErrors : inputErrors
        })
        return !inputErrors.length
    }
    register = e => {
        if(this.frontEndRegisterCheck()){
            var xhr = new XMLHttpRequest()
            xhr.open('POST','http://localhost:8000/register/')
            xhr.setRequestHeader('content-type','application/json')
            xhr.onload = () => {
                console.log('response:',xhr.response,'status:',xhr.status)
                this.errorHandle(JSON.parse(xhr.response))
            }
            xhr.send(JSON.stringify({username: this.state.registerUser, password: this.state.registerPass, password2: this.state.registerPass2}))
        }
    }
    login = () => {
        if(this.frontEndLoginCheck()){
            this.props.login(
                this.state.loginUser,
                this.state.loginPass,
                response=>this.errorHandle(response)
                )
        }
    }

    loginUserHandle = e => {
        e.target.style.borderColor = 'none'
        this.setState({
            loginUser : e.target.value
        })      
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
                loginUser : '',
                loginPass : '',
                registerUser : '',
                registerPass : '',
                registerPass2 : '',
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
        transform: 'translateY(-50%) translateX(-50%) scale(1.25)',
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
    errorMessage = {
        padding:'3px',
        whiteSpace: 'nowrap',
        fontSize : '70%',
        color:'white',
        left:'270px',
        position:'absolute',
        boxShadow:'0px 0px 5px rgba(255,255,255,0.9)',
        marginTop:'7px',
        backgroundColor: '#777777',
        borderRadius:'5px'
    }
    loginTab = {
        lineHeight : '25px',
    }
    registerTab = {
        lineHeight : '25px',
    }    //stylecomponents
    render(){
        //console.log(this.state.inputErrors)
        var errorUsername, errorPassword, errorPassword2
        var userInputStyle = {boxShadow : 'none'}
        var passInputStyle = {boxShadow : 'none'}
        var pass2InputStyle = {boxShadow : 'none'}
        if (this.state.inputErrors.length){
            for (let i of this.state.inputErrors){
                if (i['username']){
                    userInputStyle['boxShadow'] = '0px 0px 5px rgba(255,0,0,0.9)'
                    errorUsername = <span style={this.errorMessage}>{i['username']}</span>
                    
                }
                if (i['password']){
                    passInputStyle['boxShadow'] = '0px 0px 5px rgba(255,0,0,0.9)'
                    errorPassword = <span style={this.errorMessage}>{i['password']}</span>
                }
                if (i['password2']){
                    pass2InputStyle['boxShadow'] = '0px 0px 5px rgba(255,0,0,0.9)'
                    errorPassword2 = <span style={this.errorMessage}>{i['password2']}</span>
                }
            }
        }
        if (this.state.view == 'login') {
            var loginStyle = this.loginTab
            var registerStyle = Object.assign({
                backgroundColor : 'rgba(255,255,255,0.1)', 
                cursor : 'pointer'
            },{...this.registerTab})

            var view = <>
                Username<span><input key='logUser' style={userInputStyle} onChange={this.loginUserHandle}/>{errorUsername}</span>
                Password<span><input key='logPass' style={passInputStyle} onChange={this.loginPassHandle} type={'password'}/>{errorPassword}</span>
                <button onClick={this.login}>login</button>
            </>
        } else {
            var loginStyle = Object.assign({
                backgroundColor : 'rgba(255,255,255,0.1)', 
                cursor : 'pointer'
            },{...this.loginTab})
            var registerStyle = this.registerTab 

            var view =  <>
                Username<span><input key='regUser' style={userInputStyle} onChange={this.registerUserHandle}/>{errorUsername}</span>
                Password<span><input key='regPass' style={passInputStyle} onChange={this.registerPassHandle} type={'password'}/>{errorPassword}</span>
                Confirm Password<span><input key='regPass2' style={pass2InputStyle} onChange={this.registerPass2Handle} type={'password'}/>{errorPassword2}</span>
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