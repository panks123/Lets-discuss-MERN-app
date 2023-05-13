import React from 'react'
import styles from './Loader.module.css'
import Card from '../Card/Card'

const Loader = ({message}) => {
  return (
    <div className='cardWrapper'>
      <Card>
      <svg className = {styles.spinner} xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none"><circle cx="35" cy="35" r="33" stroke="#fff" strokeWidth="4"/><path stroke="#07F" strokeWidth="4" d="M21.294 4.98A33 33 0 1 1 4.082 23.466"/></svg>
      <span className={styles.loader__message}>
            {message}
        </span>
      </Card>
    </div>
  )
}

export default Loader
