import Router from "next/router"
import { useEffect, useState } from "react"
import { isAuth, signup } from "../../actions/auth"


const SignupComponent = () => {
    const [values, setValues] = useState({
        name: '',
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
        const user = {name, email, password}
        signup(user)
        .then(data => {
            console.log(data)
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values, name: '',
                email: '',
                password: '',
                error: '', 
                loading: false, 
                message: data.message, 
                showForm: false
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

    const signupForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group pb-4">
                    <input onChange={handleChange('name')} type="text" value={name} className="form-control" placeholder="Type your name" />
                </div>
                <div className="form-group pb-4">
                    <input onChange={handleChange('email')} type="email" value={email} className="form-control" placeholder="Type your email" />
                </div>
                <div className="form-group pb-4">
                    <input onChange={handleChange('password')} type="password" value={password} className="form-control" placeholder="Type your password" />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary">Sign up</button>
                </div>
            </form>
        )
    }
    
    return (
        <>
        {showError()}
        {showLoading()}
        {showMessage()}
        {showForm && signupForm()}
        </>
    )
}

export default SignupComponent