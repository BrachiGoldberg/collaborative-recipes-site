import axios from "axios"
import * as Actions from '../store/action'

export const GetRecipes = (setRecipes , recipes) => {
    return dispatch => {
        axios.get("http://localhost:8080/api/recipe").then(data => {
            setRecipes([...data.data])
            dispatch({ type: Actions.SET_IMAGES, images: recipes.map(x => x.Img) })
        })
    }
}

export const EditRecipe = (data, currentRecipe, nameIns,user) => {
    return axios.post("http://localhost:8080/api/recipe/edit", {
        Id: currentRecipe.Id,
        Name: data.name, UserId: user.Id, CategoryId: data.category, Img: data.img, Duration: data.duration, Difficulty: data.level, Description: data.description,
        Ingrident: data.ingridient, Instructions: nameIns
    })
}

export const AddRecipe = (data, nameIns,user) => {
    return axios.post("http://localhost:8080/api/recipe", {
        Name: data.name, UserId: user.Id, CategoryId: data.category, Img: data.img, Duration: data.duration, Difficulty: data.level, Description: data.description,
        Ingrident: data.ingridient, Instructions: nameIns
    })
}
export const DeleteRecipe = (currentRecipe) => {
    return axios.post(`http://localhost:8080/api/recipe/delete/${currentRecipe.Id}`)
}

export const GetCategories = () => {
    return dispatch =>{
        axios.get("http://localhost:8080/api/category").then(data=>{
            dispatch({type: Actions.SET_CATEGORIES, categories: [...data.data]})
        })
    }
}

export const AddCategory = (newCategory) =>{
    return axios.post("http://localhost:8080/api/category", { Id: 20, Name: newCategory })
}


