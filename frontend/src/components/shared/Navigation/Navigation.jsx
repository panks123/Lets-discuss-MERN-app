import React from 'react'
import { Link } from 'react-router-dom'
import  styles from './Navigation.module.css'
import { logout } from '../../../http'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '../../../store/authSlice'
import { setAvatar, setName } from '../../../store/activateSlice'

const Navigation = () => {

  const { isAuthenticated, user } = useSelector((state)=> state.auth );
    const dispatch = useDispatch();

    const logoutUser = async ()=>{
      try{
        const {data} = await logout();
        // clear the user and isAuth in the store after logging out
        dispatch(setAuth(data));
        // after logout clear the name also from the store
        dispatch(setName(''))
        // Also Clear the avatar data from store
        dispatch(setAvatar(null)) 
      }
      catch(err){
        console.log(err.message)
      }
    }


    const brandStyle = {
        color: "#fff",
        textDecoration : 'none',
        fontWeight: 'bold',
        fontSize: '22px',
        display: 'flex',
        alignItems: 'center'
    }
    const logoTextStyle = {
        marginLeft: '10px',

    }
  return (
    <nav className={`container ${styles.navbar}`}>
      <Link to='/' style={brandStyle}>
        <img src="/images/logo.png" alt="logo" />
        <span style={logoTextStyle}>Let's Discuss</span>
      </Link>
      {
        isAuthenticated &&
        <div className={styles.navRight}>
          <h3 style={{textAlign: 'end'}}>{user?.name}</h3>
          <Link to={`/user/${user.id}`}>
            <img 
              className={styles.avatar} src={user.avatar ? user.avatar : '/images/monkey-avatar.png'} 
              alt='avatar' 
              width="40" 
              height="40" 
            />
          </Link>
          <button className={styles.logoutButton} onClick={logoutUser}>
            <img src='/images/logout-icon.png' alt='logout' width="33"/>
          </button>
        </div>
      }
    </nav>
  )
}

export default Navigation
