import React, { useState } from 'react'
import Phone from './Phone/Phone'
import Email from './Email/Email'
import styles from './StepPhoneOrEmail.module.css'

// Map of Phone/ Email tab
const phoneOrEmailTab = {
  phone: Phone, // for phone number input tab
  email: Email // for email input tab
}

const StepPhoneOrEmail = ({ onNextClick }) => {
  const [tab, setTab] = useState('phone')

  const PhoneOrEmailTab = phoneOrEmailTab[tab]

  const toggleTab = (tab) => {
    setTab(tab)
  }

  return (
    <>
      <div className={styles.cardWrapper}>
        <div className={styles.box}>
          <div className={styles.buttonWrapper}>
            <button className={`${styles.tabButton} ${tab === 'phone' ? styles.activeTab : ''}`} onClick={() => { toggleTab('phone') }}>
              <img src="/images/phone-white.png" alt="Phone" />
            </button>
            <button className={`${styles.tabButton} ${tab === 'email' ? styles.activeTab : ''}`} onClick={() => { toggleTab('email') }}>
              <img src="/images/mail-white.png" alt="Email" />
            </button>
          </div>
          <PhoneOrEmailTab onNextClick={onNextClick} />
        </div>
      </div>
    </>
  )
}

export default StepPhoneOrEmail
