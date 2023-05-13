import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/TextInput/TextInput'
import Button from '../../../components/shared/Button/Button'
import styles from './StepOtp.module.css'
import { verifyOTP } from '../../../http'
import { useSelector } from 'react-redux'
import { setAuth } from '../../../store/authSlice'
import { useDispatch } from 'react-redux'

const StepOTP = () => {

  const [otp, setOtp] = useState('')

  const dispatch = useDispatch()

  const dataFromStore = useSelector((state)=>{
      return state.auth.otp
  })

  const { phone, hash } = dataFromStore;

  const handleChange = (e) => {
    e.preventDefault()
    setOtp(e.target.value)
  }

  const submit = async ()=>{
    if(!otp || !phone || !hash )
    {
      // If otp is not entered
      return;
    }
    try{
      const { data } = await verifyOTP({ otp, phone, hash });
      console.log(data)

      // update the auth data in the state of the user in the redux store
      dispatch(setAuth(data))
    }
    catch(err)
    {
      console.log(err.message)
    }

    
  }

  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter the OTP we just sent you" icon='lock-emoji'>
          <TextInput value={otp} onChange={(e) => handleChange(e)} />
          <div>
            <div className={styles.actionButtonWrap}>
              <Button text="Next " onClick={ submit }/>
            </div>
            <p className={styles.bottomPara}>
              By entering your number, you’re
              agreeing to our Terms of Service and Privacy Policy, Thanks!
            </p>
          </div>
        </Card>
      </div>
    </>
  )
}

export default StepOTP
