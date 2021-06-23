import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
  id:string;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswer: boolean;
  isHighlighted: boolean;
}>

type QuestionsType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswer: boolean;
  isHighlighted: boolean;
}

export function Room() {
  const {user} = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [question, setQuestion] = useState<QuestionsType[]>([])
  const [title, setTitle] = useState('')

  const roomId = params.id;

  useEffect(()=> {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswer: value.isAnswer,
        }
      })

      setTitle(databaseRoom.title);
      setQuestion(parsedQuestion);
    })
  }, [roomId])

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
    
    if (newQuestion.trim() === ''){
      return;
    }

    if (!user) {
      throw new Error('You must be logged in')
    }

    const question =  {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswer: false
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
          <div className="content">
            <img src={logoImg} alt="Letmeask"/>
            <RoomCode code={params.id}/>
          </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Room {title}</h1>
          { question.length > 0 && <span>{question.length} questions</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="What is your question"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name}/>
                <span>{user.name}</span>
              </div>
            ) : (
              <span>To send a question, <button>please login</button>.</span>
            )}
            
            <Button type="submit" disabled={!user}>Send question</Button>
          </div>
        </form>

        {}
      </main>
    </div>
  )
}
