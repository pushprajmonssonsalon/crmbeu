const Auth = (props) => {
    const {children} = props
    const isToken = localStorage.getItem('token')
    
    if(isToken){
        return children
    }
 return null
}

export default Auth
