import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import styles from './User.module.css'
import { useParams } from 'react-router-dom'
import { getUser } from '../../http';

const User = () => {
    const [userObj, setUserObj] = useState(null)

    const { id : user_id } = useParams()

    // console.log(user_id)

    useEffect(()=>{
        const fetchUser = async ()=>{
            const { data } = await getUser(user_id)
            console.log("Fetched user: ", data);
            setUserObj((prev)=> data);
          }
          fetchUser();
    }, [user_id])

    const { user } = useSelector((state) => state.auth);

    return (
        <>
        {
            userObj && <div className="container">
                <div className={styles.userHeader} >
                    <h2 className={styles.heading}>Profile</h2>
                </div>
                <div className={styles.userWrap}>
                    <div className={styles.left}>
                        <div className={styles.avatar}>
                            <img src={userObj.avatar} alt='avatar' width="150" height="150" />
                        </div>
                        <div className={styles.username}>
                            <h3>{userObj.name}</h3>
                            <small>{`@${userObj.name?.replace(' ', '').toLowerCase()}`}</small>
                        </div>
                        <div className={styles.buttonWrap}>
                            <button style={{ visibility: user.id === user_id ? 'hidden' : 'visible'}}>Follow</button>
                            <img src='/images/option-icon.png' alt='options' />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.followDetails}>
                            <div className={styles.followerDetails}>
                                <div style={{fontSize: '20px', fontWeight: 'bold'}}>25</div>
                                <small>Followers</small>
                            </div>
                            <div className={styles.followerDetails}>
                                <div style={{fontSize: '20px', fontWeight: 'bold'}}>10</div>
                                <small>Followings</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.about}>
                    <p>Full-stack Software Developer and Javascript Enthusiast, Who Loves Building Things In Javascript. 🔥 👨🏽‍💻🏅</p>
                </div>
            </div>
        }
        </>
    )
}

export default User
