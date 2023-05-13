import React, {useState } from 'react'
import Card from '../../../../components/shared/Card/Card'
import Button from '../../../../components/shared/Button/Button'
import TextInput from '../../../../components/shared/TextInput/TextInput'
import styles from '../StepPhoneOrEmail.module.css'

const Email = ({ onNextClick }) => {

  const [email, setEmail] = useState('')

  const handleChange = (e) => {
    e.preventDefault()
    setEmail(e.target.value)
  }

  return (
    <Card title="Enter your email id" icon='email'>
        <TextInput value={email} onChange={(e) => { handleChange(e) }} />
        <div>
          <div className={styles.actionButtonWrap}>
            <Button text="Next " onClick={onNextClick}/>
          </div>
          <p className={styles.bottomPara}>
            By entering your number, you’re 
            agreeing to our Terms of Service and Privacy Policy, Thanks!
          </p>
        </div>
      </Card>
  )
}

export default Email
