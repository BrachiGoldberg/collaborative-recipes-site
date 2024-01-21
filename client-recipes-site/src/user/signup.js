
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Divider, Form, FormField, Header } from 'semantic-ui-react';
import * as yup from 'yup'
import Swal from 'sweetalert2';
import { SignUpUser } from '../services/user';

const schema = yup.object({
    userName: yup.string().required('שדה חובה'),
    name: yup.string().required('שדה חובה'),
    password: yup.string().min(4, 'סיסמא חייבת להכיל לפחות 4 ספרות').required("שדה חובה"),
    phone: yup.string().min(9, 'מספר טלפון חייב להכיל לפחות 9 תווים').matches(/^[\d]+$/, 'ספרות בלבד').required("שדה חובה"),
    identity: yup.string().matches(/^[\d]{9}$/, 'אנא בדוק האם הכנסת ת.ז. תקינה').required("שדה חובה"),
    email: yup.string().email('כתובת אימייל אינה תקינה').required("שדה חובה"),
}).required()


const SignIn = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const location = useLocation();

    const [signSucc, setSignSucc] = useState()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(()=>{
        document.title = 'הרשמה'
    },[])

    useEffect(() => {
        if (signSucc === false) {
            Swal.fire({
                icon: "error",
                title: "ההרשמה נכשלה",
                text: "אנו מצטערים, אך המערכת נתקלה בבעיה. אנא בדוק את תקינות הנתונים שהכנסת ובמקרה שהתקלה תמשיך נסה להחליף שם משתמש או כתובת מייל",
                showConfirmButton: false
            })
            setSignSucc()
        }
        if (signSucc === true) {
            Swal.fire({
                icon: "success",
                titleText: "נרשמת בהצלחה!",
                text: "ברוך הבא לאתר שלנו! אנו מקווים שתהנה ממנו ותפיק ממנו תועלת מרובה",
                showConfirmButton: false,
                timer: 3000,
                didClose: () => {
                    navigate('/recipes')
                }
            })
        }
    }, [signSucc])

    const onSubmit = (data) => {
        dispatch(SignUpUser(data, setSignSucc))
    }

    return <>
        <Header as={'h2'} id="text" className='size-font'>חשבון חדש</Header>
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
                        <label  id='text'>שם</label>
                        <input {...register('name')} placeholder='שם' defaultValue={location.pathname === '/login' ? "." : ''} />
                        <p className="error">{errors['name']?.message}</p>
                    </FormField>

                    <FormField>
                        <label  id='text'>סיסמא</label>
                        <input type='password' {...register('password')} placeholder='סיסמא' />
                        <p className="error">{errors['password']?.message}</p>
                    </FormField>

                    <FormField>
                        <label  id='text'>טלפון</label>
                        <input {...register('phone')} placeholder='טלפון' defaultValue={location.pathname === '/login' ? 0 : ''} />
                        <p className="error">{errors['phone']?.message}</p>
                    </FormField>

                    <FormField>
                        <label  id='text'>תעודת זהות</label>
                        <input {...register('identity')} placeholder='ת.ז.' defaultValue={location.pathname === '/login' ? "." : ''} />
                        <p className="error">{errors['identity']?.message}</p>
                    </FormField>

                    <FormField>
                        <label  id='text'>כתובת מייל</label>
                        <input {...register('email')} placeholder='כתובת מייל' defaultValue={location.pathname === '/login' ? "." : ''} />
                        <p className="error">{errors['email']?.message}</p>
                    </FormField>

                </Form>
                <Button type='submit' >{location.pathname === '/login' ? "כניסה" : "הרשמה"}</Button>
            </form>

            <Link to={'/login'} replace={true}> לחשבון קיים לחץ כאן</Link>
        </Container>
    </>


}

export default SignIn;