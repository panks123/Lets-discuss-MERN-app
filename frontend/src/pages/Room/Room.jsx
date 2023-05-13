import { useSelector } from 'react-redux';
import { useWebRTC } from '../../hooks/useWebRTC'
import { Link, useNavigate, useParams } from 'react-router-dom';

import styles from './Room.module.css'
import { useEffect } from 'react';
import { useState } from 'react';
import { getRoom } from '../../http';

const Room = () => {

  const [room, setRoom] = useState(null)

  const [isMute, setIsMute] = useState(true)

  const { id: roomId } = useParams() // So userId we'll get from the url parameter
  const { user } = useSelector((state) => state.auth);

  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  // console.log("Client is Room",clients)
  const navigate = useNavigate()

  const handleManualLeave = () => {
    navigate('/')
  }
  

  useEffect(()=>{
    handleMute(isMute, user.id)
    // eslint-disable-next-line
  }, [isMute])

  const handleMuteClick = (clientId)=>{
    if(clientId !== user.id) return 
    // i.e. A user can mute by clicking on his own avatar mute button
    setIsMute((prev) => !prev)
  }

  useEffect(()=>{
    const fetchRoom = async ()=>{
      const { data } = await getRoom(roomId)
      console.log(data);
      setRoom((prev)=> data);
    }
    fetchRoom();
  }, [roomId])

  return (
    <div>
      <div className="container">
        <button className={styles.goBack} onClick={handleManualLeave}>
          <img src='/images/arrow-left.png' alt='go-back' />
          <span>All voice rooms</span>
        </button>
      </div>

      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          <h2 className={styles.topic}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src='/images/palm.png' alt='palm-icon' />
            </button>
            <button className={styles.actionBtn} onClick={handleManualLeave}>
              <img src='/images/win.png' alt='win-icon' />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>
        <div className={styles.clientsList}>
          {
            clients.map(client => {
              return (
                <div key={client.id} className={styles.client}>
                  <div className={styles.userHead}>
                    <audio
                      ref={(instance) => { provideRef(instance, client.id) }}
                      // controls 
                      autoPlay
                    ></audio>
                    <Link to={`/user/${client.id}`}>
                      <img className={styles.userAvatar} src={client.avatar} alt='avatar' />
                    </Link>
                    <button 
                      className={styles.micBtn} 
                      onClick={()=> handleMuteClick(client.id) }
                    >
                      {
                        client.muted ? (<img src='/images/mic-mute.png' alt='mic-mute-icon'/> ) : (<img src='/images/mic.png' alt='mic-icon' />)
                      }
                    </button>
                  </div>
                  <h4>{client.name}</h4>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Room;