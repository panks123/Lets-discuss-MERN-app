import React from 'react'
import { useNavigate} from 'react-router-dom'
import styles from './Home.module.css'
import Card from '../../components/shared/Card/Card'
import Button from '../../components/shared/Button/Button'

const Home = () => {
  const navigate = useNavigate()
  const startRegistration =()=>{
    navigate('/authenticate')
  }

  return (
    <div className={styles.cardWrapper}>
      <Card title="Welcome to Coder's House" icon='logo'>
        <p className={styles.text}>
          We are working hard to get Coder’s House ready for
          everyone. While we wrap up the finishing touches,
          we are adding people gradually to make sure that nothing breaks
        </p>
        <div>
          <Button text="Let's go " onClick={startRegistration}/>
        </div>

        <div className={styles.signinWrapper}>
          <span className={styles.hasInvite}>
            Have an invite text?
          </span>
          {/* <Link to='/login'
            style={{color: '#0077ff', fontWeight: 'bold', textDecoration: 'none', marginLeft: '7px'}}
          >
            Sign in
          </Link> */}
        </div>
      </Card>
    </div>
  )
}

export default Home
