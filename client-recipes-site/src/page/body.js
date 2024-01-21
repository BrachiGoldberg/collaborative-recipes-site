import { Route, Routes, useNavigate } from "react-router-dom";
import EditAddRecipe from "../recipe/edit-add-recipe";
import ShoppingList from "../buy/shooping-list";
import LogIn from "../user/login";
import Recipes from "../recipe/recipes";
import SignIn from "../user/signup";
import RecipeDetailes from "../recipe/recipe-detailes";
import { useEffect } from "react";
import Home from "./home";

const Body = () => {

    const navigate = useNavigate()
    return <Routes>
 
        <Route path="/" element={<>{useEffect(() => { navigate('/home') }, [])}</>}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/signup" element={<SignIn />}></Route>
        <Route path="/logout" element={<LogIn />}></Route>
        <Route path="/recipes" element={<Recipes />}>
            <Route path=":id" element={<RecipeDetailes />} />
        </Route>

        <Route path="/edit" element={<EditAddRecipe />}></Route>
        <Route path="/add" element={<EditAddRecipe />}></Route>
        <Route path="/cart" element={<ShoppingList />}></Route>

        <Route path="/myrecipes" element={<Recipes />} >
            <Route path=":id" element={<RecipeDetailes />} />
        </Route>
        <Route path="/addrecipe" element={<div>כאן יופיע אפשרות הוספת מתכון / עריכת מתכון קיים</div>}></Route>
    </Routes>
}

export default Body;