import axios from "axios"
import * as Actions from '../store/action'

export const LogInUser = (data, setLoginSucc) => {
    return dispatch => {
        axios.post("http://localhost:8080/api/user/login",{ Username: data.userName, Password: data.password })
            .then(d => {
                setLoginSucc(true)
                dispatch({ type: Actions.SET_USER, user: { Id: d.data.Id, UserName: d.data.Username } })
            })
            .catch(error => setLoginSucc(false))
    }
}

export const SignUpUser = (data, setSignSucc) => {
    return dispatch => {
        axios.post("http://localhost:8080/api/user/sighin", {
            Username: data.userName, Password: data.password, Name: data.name,
            Phone: data.phone, Email: data.email, Tz: data.identity
        }).then(data => {
            setSignSucc(true)
            dispatch({ type: Actions.SET_USER, user: { Id: data.data.Id, UserName: data.data.Username } })
        })
            .catch(error => setSignSucc(false))
    }
}