import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import styles from './StepAvatar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import { activate } from '../../../http';
import { setAuth } from '../../../store/authSlice';
import Loader from '../../../components/shared/Loader/Loader';

const StepAvatar = ({ onNextClick }) => {

  const [loading, setLoading] = useState(false)

  const { name, avatar } = useSelector( (state)=> state.activate );
  const [image, setImage] = useState('./images/monkey-avatar.png')
  const dispatch = useDispatch();

  const submit = async () => {

    if(!name || !avatar){
      // If avatar was not chosen
      return;
    }
    // after clicking subit(next in the UI) -> start the loading indicator
    setLoading(true)
    try{
      const { data } = await activate({ name, avatar })
      if(data.auth){
        // if user has been authenticated successfully then 
        // store the authenticated as well as ACTIVATED user in the store
        dispatch(setAuth(data))
      }
    }
    catch(err){
      console.log(err.message)
    }
    finally{
      // after the request is over - stop the loading indicator
      setLoading(false)
    }
  }

  const captureAvatar = (e)=>{
    const avatarFile = e.target.files[0] // to get the input file
    // console.log(avatarFile)

    // we will convert it to base64 stream
    // create a filereader instance
    const reader = new FileReader() // it is provided as a browser API
    reader.readAsDataURL(avatarFile)
    reader.onloadend = ()=>{
      // console.log(reader.result)
      // after the image has loaded into the reader stream
      setImage(reader.result) // reader.result is basically a base64 string
      // after that store it to the store so that it is not lost on back button press
      dispatch(setAvatar(reader.result))
    }
  }

  
  if(loading) return <Loader message='Activation in progress...'/>
  return (
    <>
      <Card title={`Okay, ${name}?`} icon='monkey-emoji'>
        <p className={styles.subHeading}>How's this photo?</p>
        <div className={styles.avatarWrapper}>
          <img src={image} alt='avatar' className={styles.avatar} />
        </div>
        <div>
          <input 
            id='avatarInput' 
            type='file' 
            className={styles.avatarInput} 
            onChange={captureAvatar}
          />
          <label htmlFor='avatarInput' className={styles.avatarInputLabel}>Choose a different photo</label>
        </div>
        <div>
          <Button text="Next " onClick={submit} />
        </div>
      </Card>
    </>
  )
}

export default StepAvatar;
