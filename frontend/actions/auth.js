import fetch from 'isomorphic-fetch'
import {API} from '../config'
import cookie from 'js-cookie'

export const signup = (user) => {
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => {
        console.error(error)
    })
}

export const signin = (user) => {
    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => {
        console.error(error)
    })
}

export const signout = (next) => {
    removeCookie('token')
    removeLocalStorage('user')
    next()

    return fetch(`${API}/signout`, {
        method: 'GET'
    })
    .then(response => {
        console.log('signed out')
    })
    .catch(err => {
        console.error(err)
    })
}

export const setCookie = (key, value) => {
    cookie.set(key, value, {
        expires: 1
    })
}

export const removeCookie = (key) => {
    cookie.remove(key)
}

export const getCookie = (key) => {
    return cookie.get(key)
}

export const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

export const removeLocalStorage = (key) => {
    localStorage.removeItem(key)
}

export const authenticate = (data, next) => {
    setCookie('token', data.token)
    setLocalStorage('user', data.user)
    next()
}

export const isAuth = () => {
    const cookieChecked = getCookie('token')
        if(cookieChecked) {
            if(localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'))
            } else {
                return false
            }
        } 
}
