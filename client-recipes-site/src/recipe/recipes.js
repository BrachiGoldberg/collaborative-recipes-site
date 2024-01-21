import { useEffect, useState } from "react";
import { Card, CardMeta, Divider, Dropdown, Grid, GridColumn, Header, Icon, Image, Input, Item, ItemMeta, MenuItem } from "semantic-ui-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from '../store/action'
import { GetCategories, GetRecipes } from "../services/recipes";

const Recipes = () => {

    const [filterCategories, setFilterCategories] = useState([])
    const [filterDifficulty, setFilterDifficulty] = useState()
    const [filterDuration, setFilterDuration] = useState()
    const [filterUser, setFilterUser] = useState()
    const [recipes, setRecipes] = useState([])

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const user = useSelector(state => state.user)
    const currentRecipe = useSelector(state => state.currentRecipe)
    const categories = useSelector(state=>state.categories)

    useEffect(() => {
        if (!user)
            navigate('/login')
    }, [user])


    useEffect(() => {
        if (location.pathname == '/recipes') {
            dispatch({ type: Actions.SET_CURRENT_RECIPE, recipe: null })
            setFilterUser()
            document.title = 'מתכונים'

        }
        if (location.pathname == '/myrecipes') {
            setFilterUser(user.Id)
            document.title = 'המתכונים שלי'
        }
        dispatch(GetRecipes(setRecipes, recipes))
    }, [location])

    useEffect(() => {
        dispatch(GetCategories())
    }, [])

    const categoryOption = categories.map((x, i) => (
        { key: i, text: x.Name, value: x.Id }
    ))

    return <>
        <Outlet />
        {!currentRecipe &&
            <Grid className="pt">
                <GridColumn width={4}>
                    <MenuItem>
                        <Dropdown
                            placeholder='סנן לפי קטגוריות...'
                            fluid
                            multiple
                            search
                            selection
                            onChange={(e, data) => {
                                setFilterCategories([...data.value])
                            }}
                            options={categoryOption}
                        />
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <Item id="text">רמת קושי:  {filterDifficulty == 1 ? 'קל' : filterDifficulty == 2 ? 'בינוני' : filterDifficulty == 3 ? 'קשה' : ''}</Item>
                        <Input type='range' min='1' max='3' onChange={(e, data) => setFilterDifficulty(data.value)} />
                    </MenuItem>
                    <Divider />

                    <MenuItem>
                        <ItemMeta id="text">סנן לפי זמן הכנה מירבי:</ItemMeta>
                        <Input type="number" onChange={(e, data) => setFilterDuration(data.value)} placeholder='משך זמן הכנה' />
                    </MenuItem>
                </GridColumn>
                <GridColumn width={12}>
                    <Grid>

                        {recipes.filter((x) => (
                            (!filterUser || x.UserId == filterUser)
                            &&
                            (filterCategories.length == 0 || filterCategories.findIndex(y => y == x.CategoryId) != -1)
                            &&
                            (!filterDifficulty || x.Difficulty <= filterDifficulty)
                            &&
                            (!filterDuration || x.Duration <= filterDuration)
                        )).map((x, i) => <>

                            <GridColumn width={5} stretched key={i}>
                                <Card onClick={() => {
                                    dispatch({ type: Actions.SET_CURRENT_RECIPE, recipe: x })
                                    navigate(`${x.Id}`)
                                }}>
                                    <Header textAlign="center">{x.Name}</Header>
                                    <Grid>
                                        <GridColumn width={5}><Icon name='clock outline' /> {x.Duration}</GridColumn>
                                        <GridColumn width={7}>{categories.find(c => c.Id == x.CategoryId)?.Name}</GridColumn>
                                        <GridColumn width={2}>{x.Difficulty == 1 ? 'קל' : x.Difficulty == 2 ? "בינוני" : "קשה"}</GridColumn>
                                    </Grid>
                                    <Image src={x.Img} />
                                    <CardMeta textAlign="center">{x.Description}</CardMeta>
                                </Card>
                            </GridColumn>

                        </>
                        )}
                    </Grid>
                </GridColumn>
            </Grid>}
    </>
}

export default Recipes;