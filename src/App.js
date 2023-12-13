import { useRef, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import Cookies from 'universal-cookie'
import { Chat } from './components/chat';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const cookies = new Cookies()

function App() {

      const [isAuth, setIsAuth] = useState(cookies.get('auth-token'))
      const [room, setRoom] = useState(null)

      const roomInputRef = useRef(null)

      if (!isAuth) {
  return (
    <div className="App">
       <div className='navbar'>
        <div className='logo'>
          Live Chat
        </div>
      </div>
      <Auth setIsAuth={setIsAuth} />
    </div>
  );
      }

      const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          setRoom(roomInputRef.current.value)
        }
      }

      const logUserOut = async () => {
        await signOut(auth)
        cookies.remove('auth-token')
        setIsAuth(false)
        setRoom(null)
    }

      return (
        <div>
          <div className='navbar'>
        <div className='logo'>
          Live Chat
        </div>
      </div>
        {room ? ( <Chat room={room} /> ) :
        (
        <div className='room'>
          <h3>Enter Room Name</h3>
          <input ref={roomInputRef} className='room-input' onKeyDown={handleKeyDown} />
          <button onClick={() => setRoom(roomInputRef.current.value)}>enter chat room</button>
          </div> )}
          <div className='logout'><button className='logout-btn' onClick={logUserOut}>Log Out</button></div>
        </div>
      )
}

export default App;
