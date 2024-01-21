import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {  useLocation, useNavigate } from "react-router-dom";
import { Button, Confirm, Container, Form, FormField, FormGroup, Header, Input, Segment } from "semantic-ui-react";
import * as yup from 'yup'
import * as Actions from '../store/action'
import Swal from "sweetalert2";
import { AddCategory, AddRecipe, EditRecipe, GetCategories } from "../services/recipes";






const schema = yup.object({
    name: yup.string().required('הכנס שם מתכון'),
    img: yup.string().required('קישור לתמונה'),
    description: yup.string().required('לתועלת כולנו תאר בקצרה את המתכון'),
    duration: yup.number("הכנס מספר").positive().required('הכנס משך זמן הכנה '),
    level: yup.string().required('לא בחרת רמת קושי'),
    category: yup.string().required('בחר קטגוריה'),
    ingridient: yup.array().of(
        yup.object().shape({
            Count: yup.string().matches(/^[\d]+[\./\\]?[\d]*$/).required('שדה חובה'),
            Name: yup.string().required('הכנס שם מצרך, אם אינך זקוק לשדה זה אנא מחק אותו'),
            Type: yup.string().nullable(),
        })
    ),
    instructions: yup.array().of(
        yup.object().shape({
            ins: yup.string().required('אם אינך זקוק לשדה זה אנא מחק אותו')
        })
    )
}).required();

const EditAddRecipe = () => {

    const currentRecipe = useSelector(state => state.currentRecipe)
    const user = useSelector(state => state.user)
    const categories = useSelector(state=>state.categories)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const [instruction, setInstruction] = useState()
    const [showConfirm, setShowConsfirm] = useState(false)
    const [existsCatedory, setExistsCategory] = useState(false)
    const [newCategory, setNewCategory] = useState()
    const [newField, setNewField] = useState(true)

    useEffect(() => {
        dispatch(GetCategories())
    }, [categories])

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "ingridient",
    });

    const { fields: fieldsInstruction, append: appendInstruction, remove: removeInstruction, } = useFieldArray({
        control,
        name: "instructions",
    });

    useEffect(() => {
        if (currentRecipe) {
            fields.push(...currentRecipe.Ingrident);
            fieldsInstruction.push(...currentRecipe.Instructions);
        }
    }, [])

    useEffect(() => {
        if (location.pathname == '/add') {
            reset()
            dispatch({ type: Actions.SET_CURRENT_RECIPE, recipe: null })
            remove()
            removeInstruction()
            document.title = 'מתכון חדש'

        }
        else {
            document.title = 'עריכת מתכון'
        }
    }, [location])

    const addNewCategory = (data) => {
        if (categories.find(x => x.Name == data.value)) {
            setExistsCategory(true);
            setNewCategory();
        }
        else {
            setExistsCategory(false);
            setNewCategory(data.value);
        }

    }
    const onSubmit = data => {
        let nameIns = data.instructions.map(x => x.ins)
        if (location.pathname == '/add') {
            AddRecipe(data, nameIns, user)
                .then(() => {
                    Swal.fire({
                        icon: "success",
                        title: "המתכון התווסף בהצלחה",
                        footer: ` לעריכת המתכון <Link to={'/edit'}>לחץ כאן</Link> `,
                        didClose: () => navigate('/recipes')

                    });
                })
        }
        else {
            EditRecipe(data, currentRecipe, nameIns,user).then(data => {
                Swal.fire({
                    icon: "success",
                    title: "המתכון עודכן בהצלחה",
                    didClose: () => navigate('/recipes')
                })
            }
            ).catch(error => Swal.fire({
                icon: "error",
                title: "אופס...",
                text: "משהו השתבש נסה שוב מאוחר יותר",
                didClose: () => navigate('/recipes')
            }))
        }
    }
    return <>
        <Container text>
            {currentRecipe && <Header id="text" className="size-font">עריכת מתכון - {currentRecipe.Name}</Header>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Form >
                    <FormField required={true} error={errors.name?.message}>
                        <label  id='text'>שם המתכון</label>
                        <input {...register("name")} defaultValue={currentRecipe ? currentRecipe.Name : ''} />
                        <p className="error">{errors.name?.message}</p>
                    </FormField>

                    <FormField required={true} error={errors.description?.message}>
                        <label  id='text'>ספר אודות המתכון שלך--</label>
                        <input {...register("description")} defaultValue={currentRecipe ? currentRecipe.Description : ''} />
                        <p className="error">{errors.description?.message}</p>
                    </FormField>

                    <FormField required={true} error={errors.duration?.message}>
                        <label  id='text'>משך זמן הכנה</label>
                        <input {...register("duration")} defaultValue={currentRecipe ? currentRecipe.Duration : ''} />
                        <p className="error">{errors.duration?.message}</p>
                    </FormField>

                    <FormField required={true} error={errors.level?.message} id='text'>

                        <label id='text'>רמת קושי</label>
                        <input {...register('level')} type='radio' name='level' value='1' defaultChecked={currentRecipe && currentRecipe.Difficulty == 1 ? true : false} /> קל
                        <input {...register('level')} type='radio' name='level' value='2' defaultChecked={currentRecipe && currentRecipe.Difficulty == 2 ? true : false} /> בינוני
                        <input {...register('level')} type='radio' name='level' value='3' defaultChecked={currentRecipe && currentRecipe.Difficulty == 3 ? true : false} /> קשה
                        <p className="error">{errors.level?.message}</p>
                    </FormField>

                    <FormField required={true} error={errors.img?.message}>
                        <label  id='text'>קישור לתמונה</label>
                        <input {...register("img")} defaultValue={currentRecipe ? currentRecipe.Img : ''} />
                        <p className="error">{errors.img?.message}</p>
                    </FormField>

                    <FormField required={true} width={8} inline error={errors.categories?.message}>
                        <label  id='text'>קטגוריה</label>
                        <select {...register('category')} >
                            {categories?.map((x, i) =>
                                <option key={i} value={x.Id} selected={currentRecipe && x.Id == currentRecipe.CategoryId}>{x.Name} </option>)}
                        </select>
                        <p className="error">{errors.categories?.message}</p>


                        <Button type="button" onClick={(e) => { setShowConsfirm(!showConfirm) }}>הוסף קטגוריה</Button>
                        <Confirm
                            open={showConfirm == true}
                            header='הוספת קטגוריה חדשה'
                            content={
                                <Segment>
                                    <Input
                                        placeholder='קטגוריה חדשה'
                                        onChange={(e, data) => addNewCategory(data)}
                                    />
                                    {existsCatedory && <div>קטגוריה קיימת</div>}
                                </Segment>
                            }
                            confirmButton={"שמור קטגוריה"}
                            onCancel={() => setShowConsfirm(false)}
                            onConfirm={(e, data) => {
                                if (!existsCatedory && newCategory) {
                                    
                                        AddCategory(newCategory).then(data => {
                                            Swal.fire({
                                                title: "הפעולה נקלטה בהצלחה",
                                                timer: 1500,
                                                icon: "success",
                                                showConfirmButton: false,
                                            });
                                        })
                                        .catch(error => {
                                            Swal.fire({
                                                title: "אופס..",
                                                text: "נראה שמשהו השתבש, נסה מאוחר יותר",
                                                timer: 1500,
                                                icon: "error",
                                                showConfirmButton: false,
                                            });
                                        })
                                    setShowConsfirm(false)
                                }
                            }}
                        />
                    </FormField>
                </Form>


                {fields.map((field, index) => (
                    <Form key={index}>
                        <FormGroup widths='equal'>
                            <Button type="button" onClick={() => remove(index)} icon='remove' size="mini" circular secondary />
                            <FormField required={true} error={errors?.ingridient?.find((x, i) => errors.ingridient[i] && index == i)?.Name?.message}>
                                <label  id='text'>שם</label>
                                <input {...register(`ingridient.${index}.Name`)} defaultValue={field.Name? field.Name: ""} />
                                <p className="error">{errors?.ingridient?.find((x, i) => errors.ingridient[i] && index == i)?.Name?.message}</p>
                            </FormField>

                            <FormField required={true} error={errors?.ingridient?.find((x, i) => errors.ingridient[i] && index == i)?.Count?.message}>
                                <label  id='text'>כמות</label>
                                <input {...register(`ingridient.${index}.Count`)} defaultValue={field.Count? field.Count: ""} />
                                <p className="error">{errors?.ingridient?.find((x, i) => errors.ingridient[i] && index == i)?.Count?.message}</p>
                            </FormField>

                            <FormField error={errors?.ingridient?.find((x, i) => errors.ingridient[i] && index == i)?.Type?.message}>
                                <label  id='text'>סוג (כוס/ כף...)</label >
                                <input {...register(`ingridient.${index}.Type`)} defaultValue={field.Type? field.Type: ""} />
                                <p className="error">{errors?.ingridient?.find((x, i) => errors.ingridient[i] && index == i)?.Type?.message}</p>
                            </FormField>
                        </FormGroup>
                    </Form>
                ))}
                <Button type='button' onClick={() => {
                    if (!errors.ingridient)
                        append({})
                }}> מצרך נוסף</Button>
                <hr />

                {fieldsInstruction.map((field, index) => (
<>
                     <Form key={index} width={10}>
                        <FormField width={10} inline required={true} error={errors?.instructions?.find((x, i) => errors.instructions[i] && index == i)?.ins?.message}>
                            <Button circular color="red" secondary size="mini" icon='remove' type="button" onClick={() => {
                                removeInstruction(index)
                                if (!fieldsInstruction)
                                    setInstruction();
                            }} />
                            <label  id='text'><h4> {index + 1} </h4></label>
                            <input  {...register(`instructions.${index}.ins`)} defaultValue={(location.pathname == '/edit' && newField ) && field  ? field : ''} />
                        </FormField>
                        <p className="error">{errors?.instructions?.find((x, i) => errors.instructions[i] && index == i)?.ins?.message}</p>
                    </Form>
                    </>
                ))}
                {instruction && <Button type="button" onClick={() => {
                    if ((!errors.instructions) && (!errors.ingridient)){
                        appendInstruction({})
                        setNewField(false)
                    }
                }}>הוראה נוספת</Button>}

                {!instruction && <Button type="button" onClick={() => {
                    if ((!errors.instructions) && (!errors.ingridient)) {
                        setInstruction(1)
                        appendInstruction({})
                        setNewField(false)
                    }
                }}>הוראות למתכון</Button>}

                <Button type="submit" >שלח</Button>
            </form>
        </Container>
    </>
}

export default EditAddRecipe;