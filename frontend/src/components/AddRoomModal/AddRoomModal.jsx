import React, { useState } from 'react'
import styles from './AddRoomModal.module.css'
import TextInput from '../shared/TextInput/TextInput'
import { createRoom as create } from '../../http'
import { useNavigate } from 'react-router-dom'

const AddRoomModal = ({ onCloseModal }) => {

    const navigate = useNavigate();

    const [topic, setTopic] = useState('')
    const [roomType, setRoomType] = useState('open');

    const createRoom = async ()=>{
        // server call
        try{
            if(!topic){
                return
            }
            const { data } = await create({topic, roomType});
            // rediirect to the room page
            navigate(`/room/${data.id}`) // data.id is the room id of the created room
            console.log(data);
        }
        catch(err){
            console.log(err.message)
        }
    }

  return (
    <div className={styles.modalMask}>
      <div className={styles.modalBody}>
        <button className={styles.closeButton} onClick={onCloseModal}>
            <img src='/images/close.png' alt='close'/>
        </button>
        <div className={styles.modalHeader}>
            <h3 className={styles.heading}>Enter the topic to be discussed</h3>
            <TextInput fullwidth='true' value={topic} onChange={(e)=>{ setTopic(e.target.value)}}/>
            <h3 className={styles.subHeading}>Choose Room Type</h3>
            <div className={styles.roomTypes}>
                <div className={`${styles.typeBox} ${roomType === 'open' ? styles.activeRoom : ''}`} onClick={()=> setRoomType('open')}>
                    <img src= '/images/globe.png' alt='globe' />
                    <span>Open</span>
                </div>
                <div className={`${styles.typeBox} ${roomType === 'social' ? styles.activeRoom : ''}`} onClick={()=> setRoomType('social')}>
                    <img src= '/images/social.png' alt='social' />
                    <span>Social</span>
                </div>
                <div className={`${styles.typeBox} ${roomType === 'private' ? styles.activeRoom : ''}`} onClick={()=> setRoomType('private')}>
                    <img src= '/images/lock.png' alt='lock' />
                    <span>Private</span>
                </div>
            </div>
        </div>
        <div className={styles.modalFooter}>
            <h3>Start a room, open to everyone</h3>
            <button className={styles.footerButton} onClick={createRoom}>
                <img src='/images/celebration.png' alt='celebration'/>
                <span>Let's go</span>
            </button>
        </div>
      </div>
    </div>
  )
}

export default AddRoomModal
