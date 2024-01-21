import * as Actions from './action'

const initialStore = {
    user: null,
    categories: [],
    currentRecipe: null,
    shoppingList: null,
    images: []
}

const reducer = (state = initialStore, action) => {
    switch (action.type) {
        case Actions.SET_USER:
            return { ...state, user: action.user }
        case (Actions.REMOVE_USER):
            return { ...state, user: null }
        case (Actions.SET_CURRENT_RECIPE):
            return { ...state, currentRecipe: action.recipe }
        case (Actions.SET_CATEGORIES):
            return { ...state, categories: action.categories }
        case (Actions.SET_IMAGES):
            return { ...state, images: action.images }
        default:
            return { ...state }
    }
}

export default reducer;