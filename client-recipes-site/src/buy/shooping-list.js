import { useSelector } from "react-redux";
import { Button, Icon, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { GetList, RemoveItem, UpdateItem } from "../services/shopping-list";

const ShoppingList = () => {


    const user = useSelector(state => state.user)

    const [buying, setBuying] = useState([])
    useEffect(() => {
        GetList(user).then(data => setBuying([...data.data]))
    }, [buying])

    useEffect(() => {
        document.title = 'רשימת הקניות שלי'
    }, [])

    const removeItem = (name, id) => {
        RemoveItem(id)
        setBuying([])
    }


    const updateItem = (type, buy) => {
        switch (type) {
            case '+':
                UpdateItem(buy, user, 1)
                break;
            case '-':
                if (buy.Count - 1 == 0)
                    removeItem(buy.Name, buy.Id)
                else
                    UpdateItem(buy, user, -1)
                break;
        }
    }
    return <>

        <Button onClick={() => window.print()} icon='print' content='הדפס' labelPosition="right" />
        <Table basic='very' textAlign="right" id="bg">
            <TableHeader>
                <TableRow>
                    <TableHeaderCell width={2}>הסרה</TableHeaderCell>
                    <TableHeaderCell width={2}>+</TableHeaderCell>
                    <TableHeaderCell width={2}>-</TableHeaderCell>
                    <TableHeaderCell>כמות</TableHeaderCell>
                    <TableHeaderCell>מוצר</TableHeaderCell>
                </TableRow>
            </TableHeader>

            <TableBody>
                {buying.map((x,i) => <>
                    <TableRow key={i} id="bg">
                        <TableCell>
                            <Button type="button" onClick={() => removeItem(x.Name, x.Id)}>
                                <Icon name='times circle outline' />
                            </Button>
                        </TableCell>
                        <TableCell>
                            <Button onClick={() => updateItem('+', x)}>+</Button>
                        </TableCell>
                        <TableCell>
                            <Button onClick={() => updateItem('-', x)}>-</Button>
                        </TableCell>
                        <TableCell>{x.Count}</TableCell>
                        <TableCell>{x.Name}</TableCell>
                    </TableRow></>)}
            </TableBody>
        </Table>
    </>

}
export default ShoppingList;