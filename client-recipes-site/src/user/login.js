import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Divider, Form, FormField, Header } from 'semantic-ui-react';
import * as yup from 'yup'
import * as Actions from '../store/action'
import Swal from 'sweetalert2'
import { LogInUser } from '../services/user';


const schema = yup.object({
    userName: yup.string().required('שדה חובה'),
    password: yup.string().required("שדה חובה"),
}).required()


const LogIn = () => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const location = useLocation();

    const [loginSucc, setLoginSucc] = useState()

    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-start",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
        didClose: () => {
            navigate('/recipes')
        }
    });

    useEffect(()=>{
        document.title = 'כניסה'
    },[])
    useEffect(() => {
        if (location.pathname == '/logout')
            dispatch({ type: Actions.REMOVE_USER })
    }, [location])

    useEffect(() => {
        if (loginSucc == false) {
            Swal.fire({
                icon: "error",
                title: "ההתחברות נכשלה",
                text: "אנו מצטערים, אך כנראה יש לך טעות בהקלדת הנתונים. נסה שוב",
                showConfirmButton: false
            })
            setLoginSucc()
        }
        if (loginSucc == true) {
            Toast.fire({
                icon: "success",
                title: "Signed in successfully",
                background: "black"
            });
            setLoginSucc()
        }
    }, [loginSucc])


    const onSubmit = (data) => {
        dispatch(LogInUser(data, setLoginSucc))
    }
    return <>
        <Header as={'h2'} id="text" className='size-font'>כניסה</Header>
        <Divider />

        <Container text>
            <form onSubmit={handleSubmit(onSubmit)}>

                <Form>
                    <FormField>
                        <label  id='text'>שם משתמש</label>
                        <input {...register('userName')} placeholder='שם משתמש' />
                        <p className="error">{errors['userName']?.message}</p>
                    </FormField>

                    <FormField>
                        <label  id='text'>סיסמא</label>
                        <input type='password' {...register('password')} placeholder='סיסמא' />
                        <p className="error">{errors['password']?.message}</p>
                    </FormField>

                </Form>
                <Button type='submit' >כניסה</Button>
            </form>

           <Link to={'/signup'} replace={true}>    אין לך חשבון? הכנס כאן   </Link>
        </Container>
    </>


}

export default LogIn;