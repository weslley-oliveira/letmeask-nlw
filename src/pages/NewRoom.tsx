import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import firebase from 'firebase'


export function NewRoom() {
  const {user} = useAuth();
  const history = useHistory(); 
  const [newRoom, setNewRoom] = useState('');

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,      
    })

    history.push(`/rooms/${firebaseRoom.key}`)
  }

  return (
    <div id="page-auth">
      <aside>
        {/* novo jeito de importar img */}
        <img src={illustrationImg} alt="Illustration"/>
        <strong>Create your real time room to ask </strong>
        <p>Aks about your questions in realtime</p>
      </aside>
      <main>        
        <div className="main-content">
          <img src={logoImg} alt="Letmeask"/>          
          <h2>Creat a new room</h2>        
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Room Name"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Create room            
            </Button>
          </form>
          <p>
            Do you want to go to existing room? <Link to="/"> Click here</Link>
          </p>
        </div>
      </main>      
    </div>
  )
}