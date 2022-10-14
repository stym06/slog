import Router from "next/router"
import { useEffect, useState } from "react"
import { authenticate, isAuth, signin } from "../../actions/auth"


const SigninComponent = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    const {name, email, password, error, loading, message, showForm} = values

    useEffect(() => {
        isAuth() && Router.push(`/`)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        setValues({...values, loading: true, error: false})
        const user = {email, password}
        signin(user)
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
               // save user token to cookie
               // save user info to localStorage
               // authenticate user
               authenticate(data, () => {
                    if(isAuth() && isAuth().role === 1) {
                        Router.push(`/admin`)
                    } else {
                        Router.push(`/user`)
                    }
                })
            }

        })
        
    }

    const handleChange = name => (e) => {
        setValues({...values, error: false, [name]: e.target.value})
    }

    const showLoading = () => (loading ? <div className="alert alert-info">Loading...</div> : '')
    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '')
    const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '')

    const signinForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group pb-4">
                    <input onChange={handleChange('email')} type="email" value={email} className="form-control" placeholder="Type your email" />
                </div>
                <div className="form-group pb-4">
                    <input onChange={handleChange('password')} type="password" value={password} className="form-control" placeholder="Type your password" />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary">Sign in</button>
                </div>
            </form>
        )
    }
    
    return (
        <>
        {showError()}
        {showLoading()}
        {showMessage()}
        {showForm && signinForm()}
        </>
    )
}

export default SigninComponent