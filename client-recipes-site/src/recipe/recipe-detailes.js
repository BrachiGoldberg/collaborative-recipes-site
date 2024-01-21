import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Divider, Grid, GridColumn, GridRow, Header, Icon, Image, Item, ItemMeta, Segment } from "semantic-ui-react";
import HeaderSubHeader from "semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader";
import Swal from "sweetalert2";
import { DeleteRecipe } from "../services/recipes";
import { UpdateItem } from "../services/shopping-list";


const RecipeDetailes = () => {

    const currentRecipe = useSelector(state => state.currentRecipe)
    const images = useSelector(state => state.images);
    const user = useSelector(state => state.user);
    const categories = useSelector(state => state.categories)

    const navigate = useNavigate();

    const [DifficultyName, setDifficultyName] = useState();
    const [countBuying, setCountBuying] = useState([])
    const [categoryName, setCategoryName] = useState()

    useEffect(() => {

        document.title = currentRecipe.Name
        switch (currentRecipe?.Difficulty) {
            case 1:
                setDifficultyName('קל')
                break;
            case '1':
                setDifficultyName('קל')
                break;
            case 2:
                setDifficultyName('בינוני')
                break;
            case '2':
                setDifficultyName('בינוני')
                break;
            case 3:
                setDifficultyName('קשה')
                break;
            case '3':
                setDifficultyName('קשה')
                break;
        }

        let item = categories?.find(x => x.Id == currentRecipe.CategoryId)
        setCategoryName(item?.Name)

        setCountBuying(currentRecipe.Ingrident.map(x => ({ name: x.Name, count: 0 })))
    }, [])



    const deleteRecipe1 = () => {
        DeleteRecipe(currentRecipe).then(data => {
            Swal.fire({
                title: "המתכון נמחק בהצלחה",
                showConfirmButton: false,
                timer: 1500,
                icon: "success"
            });
            navigate('/recipes')
        }).catch(error => {
            Swal.fire({
                title: "אנו מתנצלים, אך קרתה בעיה בשרת",
                text: "נסה שוב מאוחר יותר",
                icon: "error"
            });
        })
    }

    return <>
        <Grid>
            <GridColumn width={3} textAlign="right" floated="right">
                <Grid className="opacity">
                    {images.filter((x, i) => i < images.length / 2).map(x => <>
                        <GridRow color="black" >
                            <Image src={x} size="massive" />
                        </GridRow>

                    </>)}
                </Grid>
            </GridColumn>
            <GridColumn width={8} textAlign="center">
                <GridRow >
                    <Button icon='print' onClick={() => window.print()} />
                    {user.Id == currentRecipe.UserId &&
                        <Button icon='edit outline' onClick={() => navigate('/edit')} />}
                    {user.Id == currentRecipe.UserId &&
                        <Button icon='remove' onClick={() => {
                            Swal.fire({
                                title: "האם אתה בטוח שברצונך להסיר את המתכון?",
                                text: "לאחר מכן לא תיהיה דרך לשחזר זאת",
                                showDenyButton: true,
                                confirmButtonText: "כן",
                                denyButtonText: `לא`
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    deleteRecipe1()
                                }
                            });
                        }} />}
                </GridRow>
                <GridRow>
                    <Grid>
                        <GridColumn width={8}>
                            <Header id="details" className="h">{currentRecipe.Name}</Header>
                        </GridColumn>
                        <GridColumn floated="left" width={4}>
                            <Item id="details"> <Icon name="clock outline" /> {currentRecipe.Duration}</Item>
                            <Item id="details"> <Icon name="external square alternate" /> {DifficultyName}</Item>
                            <Item id="details">{categoryName}</Item>
                        </GridColumn>
                    </Grid>
                </GridRow>
                <Image src={currentRecipe.Img} />
                <ItemMeta>{currentRecipe.Description}</ItemMeta>
                <Segment>

                    <Header textAlign="right">מצרכים:
                        <HeaderSubHeader>להוספת המצרך לעגלת הקניות שלך לחץ על האיקון המופיע בצד</HeaderSubHeader>
                    </Header>
                    {currentRecipe.Ingrident.map((x,i) =>
                        <Grid key={i}>
                            <GridColumn width={2}>
                                {countBuying.find(i => i.name == x.Name)?.count == 0 ?
                                    <Button circular icon='cart' onClick={() => {
                                        countBuying.find(i => i.name == x.Name).count++
                                        setCountBuying([...countBuying])
                                        UpdateItem(x, user, 1)
                                    }} /> :
                                    <Button circular content={countBuying.find(i => i.name == x.Name)?.count} onClick={() => {
                                        countBuying.find(i => i.name == x.Name).count++
                                        setCountBuying([...countBuying])
                                        UpdateItem(x, user, 1)
                                    }} />
                                }
                            </GridColumn>
                            <GridColumn width={2}>{x.Count} </GridColumn>
                            <GridColumn width={2}>{x.Type}</GridColumn>
                            <GridColumn width={4}>{x.Name}</GridColumn>
                        </Grid>)
                    }
                    <Divider />
                    <Header textAlign="right">
                        הוראות הכנה:
                    </Header>
                    <Grid>
                        {currentRecipe?.Instructions.map((x,i) => (
                            <GridRow key={i}>
                                <Icon name='arrow alternate circle left outline' /> {x}
                            </GridRow>
                        ))}
                    </Grid>
                    <Header textAlign="left">בתאבון!</Header>
                </Segment>

            </GridColumn>
            <GridColumn width={3} textAlign="left" floated="left">
                <Grid className="opacity">
                    {images.filter((x, i) => i > images.length / 2).map((x,i) => <>
                        <GridRow color="black" key={i}>
                            <Image src={x} size="medium" />
                        </GridRow>

                    </>)}
                </Grid>
            </GridColumn>
        </Grid>
    </>
}

export default RecipeDetailes;