import React, {useState} from 'react'
import {Avatar , Button , Paper ,Grid , Typography , Container} from '@material-ui/core';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import useStyles from './styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Input from './Input';
import {signin,signup} from '../../actions/auth'
const initialState = {
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    confirmPassword:''
}
const Auth = () => {
    const classes = useStyles();
    const[showPassword , setShowPassword] = useState(false)
    const [isSignup, setIsSignup] = useState(false);
    const [ formData , setFormData] = useState(initialState)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit=(e)=>{
        e.preventDefault()
        console.log(formData)
        if(isSignup){
            dispatch(signup(formData, navigate))
        }else{
            dispatch(signin(formData, navigate))
        }
    }
    const handleChange=(e)=>{
        setFormData({ ...formData,[e.target.name]: e.target.value})
    }
    const switchMode=()=>{
        setIsSignup((prevIsSignup)=>!prevIsSignup)
        setShowPassword(false)
    }
    const handleShowPassword = ()=> setShowPassword((prevShowPassword)=> !prevShowPassword)
    const googleSuccess= async (res) =>{
        const result = res?.clientId;
        const token = res?.credential;
        try{
            dispatch({ type:'AUTH' , data: {result, token}})
            navigate('/')
        }catch(error){
            console.log(error)
        }
    }
    const googleFailure= (err) =>{
        console.log(err)
        console.log("Google sign in was unsuccessful , Try Again Later")
    }
  return (
    <Container component='main' maxWidth='xs' >
        <Paper className={classes.paper} elevation={3}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant='h5'>{isSignup?'Sign Up':'Sign in'}</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {isSignup && (
                        <>
                            <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus half />
                            <Input name='lastName' label='last Name' handleChange={handleChange}  half />
                        </>
                    )}
                    <Input name='email' label='Email Address' handleChange={handleChange} type='email' />
                    <Input name='password' label='password' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                    {isSignup && <Input name='confirmPassword' label='Enter password again' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword}/>}
                </Grid>
                <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                    {isSignup ? 'Sign Up' : 'Sign In'}
                </Button>
                <GoogleOAuthProvider clientId='601207912034-if9ni71ckfinpq6httsiaphn6or3ha59.apps.googleusercontent.com' >
                <GoogleLogin
                    onSuccess={googleSuccess}
                    onError={googleFailure}
                />
                </GoogleOAuthProvider>
                <Grid container justifyContent='flex-end'>
                    <Grid item>
                        <Button onClick={switchMode}>
                            {isSignup ? 'Already have an account ? Sign In' : "Don't have an account ? Sign Up"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
  )
}

export default Auth


