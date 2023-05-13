import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card'
import Button from '../../../../components/shared/Button/Button'
import TextInput from '../../../../components/shared/TextInput/TextInput'
import styles from '../StepPhoneOrEmail.module.css'
import { sendOTP } from '../../../../http'
import { useDispatch } from 'react-redux'
import { setOTP } from '../../../../store/authSlice'

const Phone = ({ onNextClick }) => {

  const [phoneNumber, setPhoneNumber] = useState('')
  const dispatch = useDispatch();

  const handleChange = (e) => {
    e.preventDefault()
    setPhoneNumber(e.target.value)
  }

  const submitToNext = async ()=>{
    if(!phoneNumber) {
      // don't proceed if phone field is empty
      return;
    }
    try{
      // api call to server
      const { data } = await sendOTP({phone: phoneNumber}); // call to server
      // data = res.data

      console.log(data)

      // update data in the redux store
      dispatch(setOTP({phone: data.phone, hash: data.hash}))
      // after that go to nest step - OTP page
      onNextClick()
    }
    catch(err){
      console.log(err.message)
    }
  }

  return (
    <Card title="Enter your phone number" icon='phone'>
      <TextInput value={phoneNumber} onChange={(e) => { handleChange(e) }} />
      <div>
        <div className={styles.actionButtonWrap}>
          <Button text="Next " onClick={ submitToNext } />
        </div>
        <p className={styles.bottomPara}>
          By entering your number, you’re 
          agreeing to our Terms of Service and Privacy Policy, Thanks!
        </p>
      </div>
    </Card>
  )
}

export default Phone
