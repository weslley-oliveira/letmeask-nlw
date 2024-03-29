import { useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'

export function Home() {
  const history =useHistory();
  const {user,signInWithGoogle} = useAuth();
  const [roomCode, setRoomCode] = useState('')
 
  async function handleCreateRoom(){
    if (!user) {
      await signInWithGoogle()
    }
    
    history.push('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault()

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room Already closed.');
      return;
    }

    history.push(`/rooms/${roomCode}`);
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
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleImg} alt="google"/>
            Create with Google
          </button>
          <div className="separator">or entry with code</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Entry your code room"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
              />
            <Button type="submit">
              Lets ask            
            </Button>
          </form>            
        </div>
      </main>
    </div>
  )
}

