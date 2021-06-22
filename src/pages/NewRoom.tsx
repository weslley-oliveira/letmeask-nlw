import { Link } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'


export function NewRoom() {
  const {user} = useAuth();

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
          <form>
            <input
              type="text"
              placeholder="Room Name"
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

