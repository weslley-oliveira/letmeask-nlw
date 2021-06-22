import { useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

export function Home() {
  const history =useHistory();
  const {user,signInWithGoogle} = useAuth();
 
  async function handleCreateRoom(){
    if (!user) {
      await signInWithGoogle()
    }
    history.push('/rooms/new')
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
          <form>
            <input
              type="text"
              placeholder="Entry your code room"
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

