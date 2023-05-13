import React, { useState, useEffect } from 'react'
import styles from './Rooms.module.css'

// import rooms from './dummyData' // temporary line
import RoomCard from '../../components/RoomCard/RoomCard'
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal'
import { getAllRooms } from '../../http'

const Rooms = () => {

  const [showModal, setShowModal] =useState(false) // state to toggle display modal
  const [rooms, setRooms] = useState([])

  useEffect(()=>{
    const fetchRooms = async ()=>{
      const {data} = await getAllRooms();
      setRooms(data);
    }
    fetchRooms();
  }, [])

  function openAddRoomModal(){
    setShowModal(true)
  }

  return (
    <>
      <div className='container'>
        <div className={styles.roomsHeader} >
          <div className={styles.left}>
            <span className={styles.heading}>All voice rooms</span>
            <div className={styles.searchBox}>
              <img src='/images/search-icon.png' alt='search' />
              <input className={styles.searchInput} type='text' />
            </div>
          </div>
          <div className={styles.right}>
            <button onClick={openAddRoomModal} className={styles.startRoomBtn}>
              <img src='/images/add-room-icon.png' alt='add-room'/>
              <span>Start a room</span>
            </button>
          </div>
        </div>
        <div className={styles.roomList}>
          {
            rooms.map((room)=>{
              return <RoomCard key={room.id} room={room}/>
            })
          }
        </div>
      </div>
      {
        showModal && <AddRoomModal onCloseModal = { ()=> setShowModal(false) } />
      }
    </>
  )
}

export default Rooms
