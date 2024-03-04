import React from 'react'

const Auth = (props) => {
    const {children} = props
    const isToken = localStorage.getItem('token')
    console.log("tokencontainer",isToken)
    if(isToken){
        return children
    }
 return null
}

export default Auth
