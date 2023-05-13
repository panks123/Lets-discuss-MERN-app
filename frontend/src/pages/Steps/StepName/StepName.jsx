import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card'
import Button from '../../../components/shared/Button/Button'
import TextInput from '../../../components/shared/TextInput/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { setName } from '../../../store/activateSlice'
import styles from './StepName.module.css'

const StepName = ({onNextClick}) => {
  const { name } = useSelector((state)=> state.activate)

  const [fullName, setFullName] = useState(name); // setting the name from the state -> so that if back we move then the name is preserved

  const dispatch = useDispatch();

  const nextStepCall = ()=>{
    if(!fullName){
      return;
    }
    
    dispatch(setName(fullName));
    // After that Go to next step
    onNextClick();
  }

  return (
    <>
        <Card title="What's your name?" icon='cap-emoji'>
          <TextInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <div>
            <p className={styles.paragraph}>
              People use real names at Let's Discuss :) ! 
            </p>
            <div>
              <Button text="Next " onClick={ nextStepCall }/>
            </div>
          </div>
        </Card>
    </>
  )
}

export default StepName
