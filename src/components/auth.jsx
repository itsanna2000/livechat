import {auth, provider} from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const Auth = (props) => {

    const {setIsAuth} = props

    const signInWithGoogle = async () => {
      try {const result = await signInWithPopup(auth, provider)
       cookies.set('auth-token', result.user.refreshToken)
       setIsAuth(true)
       } catch(err) {
        console.error(err)
       }
    }

    return (
      <div className='auth'>
       <div className='login'>
        <h3>Sign In to Continue</h3>
        <button onClick={signInWithGoogle}>Sing In with Google</button>
       </div> 
       </div>
    )
}