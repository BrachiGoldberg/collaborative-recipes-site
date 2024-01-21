import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "semantic-ui-react";

const Header = () => {

   const user = useSelector(state => state.user);
   const location = useLocation()
   const navigate = useNavigate();

   const [activeItem, setActiveItem] = useState();

   const changeMenu = (name) => {
      setActiveItem(name)
      navigate(name)
   }

   useEffect(() => {
      setActiveItem(location.pathname.substring(1))
   }, [location])

   return <>
      <Menu attached='top' tabular secondary pointing className="sticky" id="header">
         {!user && <MenuItem
            name='login'
            active={activeItem === 'login'}
            onClick={(e, data) => changeMenu(data.name)}
         >
            <Link to={'/login'} className="color" id="menu-item">כניסה</Link>
         </MenuItem>
         }

         {!user && <MenuItem
            name='signup'
            active={activeItem === 'signup'}
            onClick={(e, data) => { changeMenu(data.name) }}
         >
            <Link to={'/signup'} className="color" id="menu-item">הרשמה</Link>
         </MenuItem>}

         {user && <MenuItem
            name='logout'
            active={activeItem === 'logout'}
            onClick={(e, data) => { changeMenu(data.name) }}
         >
            <Link to={'/logout'} className="color" id="menu-item">יציאה / החלף משתמש</Link>
         </MenuItem>}

         <MenuItem
            name='recipes'
            active={activeItem === 'recipes'}
            onClick={(e, data) => { changeMenu(data.name) }}
         >
            <Link to={'/recipes'} className="color" id="menu-item">מתכונים</Link>
         </MenuItem>

         {user && <MenuItem
            name='myrecipes'
            active={activeItem === 'myrecipes'}
            onClick={(e, data) => { changeMenu(data.name) }}
         >
            <Link to={'/myrecipes'} className="color" id="menu-item">המתכונים שלי</Link>
         </MenuItem>}
         {user && <MenuItem
            name='add'
            active={activeItem === 'add'}
            onClick={(e, data) => { changeMenu(data.name) }}
         >
            <Link to={'/add'} className="color" id="menu-item">מתכון חדש</Link>
         </MenuItem>}

         {user && <MenuItem
            name='cart'
            active={activeItem === 'cart'}
            onClick={(e, data) => { changeMenu(data.name) }}
         >
            <Link to={'/cart'} className="color" id="menu-item">סל הקניות שלי</Link>
         </MenuItem>}
      </Menu>

      <Outlet />
   </>
}

export default Header;