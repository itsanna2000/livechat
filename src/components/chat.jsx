import React, { useState, useEffect } from 'react'
import {addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy} from 'firebase/firestore'
import { database } from '../firebase'
import { auth } from '../firebase'


export const Chat = (props) => {

    const {room} = props

    const [newMessage, setNewMessage] = useState('')

    const messagesRef = collection(database, 'messages')

    const [messages, setMassages] = useState([])

    useEffect(() => {
        const queryMessages = query(messagesRef, 
            where('room', '==', room),
            orderBy('createdAt')
            )
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = []
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id})
            })
            setMassages(messages)
        })

        return () => unsubscribe()
    }, [])

    const handleSendMessage = async () => {
        if (newMessage === '')
        return

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            id: auth.currentUser.uid,
            room,
        })

        setNewMessage('')
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleSendMessage()
        }
      }
      

    return (
        <div className='chat-page'>
            <div className='chat-name'><h3>Chat name: {room}</h3></div>
        <div className='main'>
            <div className='messages-container'>
                {messages.map((message) => (
                    <div className='messages' key={message.id}>
                        <div className='user'><h4>{message.user}:</h4></div>
                        <p>{message.text}</p>
                    </div>
                ))}
            </div>
            </div>
            <div className='send-container'>
        <input className='msg-input' placeholder='Write your message here...'
            onChange={(e) => setNewMessage(e.target.value)} value={newMessage} onKeyDown={handleKeyDown} />
            <button className='send-btn' type='submit' onClick={handleSendMessage}>send</button>
            </div>
        </div>
    )
}