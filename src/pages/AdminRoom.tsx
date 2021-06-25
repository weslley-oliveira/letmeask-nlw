import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button'
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode'
// import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss'

type RoomParams = {
  id:string;
}

export function AdminRoom() {
  // const {user} = useAuth();
  const history = useHistory()
  const params = useParams<RoomParams>();  
  const roomId = params.id;

  const {title, question} = useRoom(roomId);
  
  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleCheckQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswer: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
          <div className="content">
            <img src={logoImg} alt="Letmeask"/>
            <div>
              <RoomCode code={params.id}/>
              <Button isOutlined onClick={handleEndRoom}>Close Room</Button>
            </div>            
          </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Room {title}</h1>
          { question.length > 0 && <span>{question.length} questions</span>}
        </div>
               
        <div className="question-list">
          {question.map(question => {
            return(
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isHighlighted={question.isHighlighted}
                isAnswer={question.isAnswer}
              >

                {!question.isAnswer && (
                  <>
                      <button
                      type="button"
                      onClick={() => handleCheckQuestion(question.id)}
                    >
                      <img src={checkImg} alt="Check" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Answer" />
                    </button>
                    </>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Delete Question" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
