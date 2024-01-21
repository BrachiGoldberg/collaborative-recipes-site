import axios from "axios"


export const GetList = (user) => {
    return axios.get(`http://localhost:8080/api/bay/${user.Id}`)

}

export const RemoveItem = (id) => {
    return axios.post(`http://localhost:8080/api/bay/delete/${id}`)
}

export const UpdateItem = (buy, user, count) => {
    return axios.post("http://localhost:8080/api/bay", { Name: buy.Name, Count: count, UserId: user.Id })
}