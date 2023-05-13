import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './RoomCard.module.css'

const RoomCard = ({ room }) => {

  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={()=> navigate(`/room/${room.id}`)}>
      <h3 className={styles.topic}>{room.topic}</h3>
      <div className={`${styles.speakers} ${ room.speakers.length === 1 ? styles.singleSpeaker : ''}`}>
        <div className={styles.avatars}>
          {
            room.speakers.map((speaker) => {
              return <img key={speaker.id} src={speaker.avatar} alt='speaker-avatar' className={styles.avatar} />
            })
          }
        </div>
        <div className={styles.names}>
          {
            room.speakers.map((speaker) => {
              return <div key={speaker.id} className={styles.nameWrapper}>
                <span>{speaker.name}</span>
                <img src='/images/chat-bubble.png' alt='chat-bubble'/>
              </div>
            })
          }
        </div>
      </div>
      <div className={styles.peopleCount}>
        <span>{room.totalPeople}</span>
        <img src='/images/user-icon.png' alt='users'/>
      </div>
    </div>
  )
}

export default RoomCard;
