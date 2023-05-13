import React, { useState } from 'react'
// import styles from './Authenticate.module.css'
import StepPhoneOrEmail from '../Steps/StepPhoneOrEmail/StepPhoneOrEmail'
import StepOTP from '../Steps/StepOTP/StepOTP'

const steps = {
    1: StepPhoneOrEmail,
    2: StepOTP, 
}

const Authenticate = () => {
    const [step, setStep] = useState(1)

    const Step = steps[step]

    const onNextClick = ()=>{
        setStep(step=> step+1)
    }

  return (
    <>
      <Step onNextClick = {onNextClick}/>
    </>
  )
}

export default Authenticate
