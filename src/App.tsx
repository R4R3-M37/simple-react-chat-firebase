import React, { useEffect, useState } from 'react'
import './App.scss'
import { useDispatch, useSelector } from 'react-redux'
import { logInGoogle, logOutGoogle } from './redux/slices/authSlice'

import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'


const App: React.FC = () => {
	const firebaseConfig = {
		apiKey: 'AIzaSyAkRz0LOefUKBy_0dirJIgeKGfDUCDwaLc',
		authDomain: 'mysecondproject-40793.firebaseapp.com',
		projectId: 'mysecondproject-40793',
		storageBucket: 'mysecondproject-40793.appspot.com',
		messagingSenderId: '613086004344',
		appId: '1:613086004344:web:618492f3f697267610198d'
	}
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig)
	} else {
		firebase.app()
	}
	const firestore = firebase.firestore()
	
	const dispatch = useDispatch()
	const {user} = useSelector((state: any) => state.auth)
	
	const [text, setText] = useState<string>('')
	const [messages, loading] = useCollectionData(firestore.collection('messages').orderBy('createdAt', 'desc'))
	
	const handleAuth = async () => {
		const auth = firebase.auth()
		if (!user) {
			const provider = new firebase.auth.GoogleAuthProvider()
			const {user} = await auth.signInWithPopup(provider)
			dispatch(logInGoogle(user))
		} else {
			dispatch(logOutGoogle())
			auth.signOut()
		}
	}
	
	
	const handleSendMessage = async () => {
		firestore.collection('messages').add({
			uid: user.uid,
			displayName: user.displayName,
			photoURL: user.photoURL,
			text,
			createdAt: firebase.firestore.FieldValue.serverTimestamp()
		})
		setText('')
	}
	
	if (loading) {
		return null
	}
	
	return (
		<div className='container'>
			<div className='header'>
				<div className='logo'>Simple Real-Time Chat UI</div>
				<button className='primary-btn' onClick={handleAuth}>{user ? 'Logout' : 'Login'}</button>
			</div>
			{
				user && (
					<>
						<div className='chat-box'>
							{
								user && messages && messages.map((message: any, index) => (
									<div className={user.uid === message.uid ? 'message primary' : 'message secondary'} key={index}>
										<div
											className={user.uid === message.uid ? 'message-header-primary' : 'message-header-secondary'}>
											<div>
												{message.displayName}
											</div>
											<img src={message.photoURL} alt=''
											     style={{width: '30px', borderRadius: '100%'}}/>
										</div>
										{message.text}
									</div>
								))
							}
						</div>
						<div className='input-area'>
							<input type='text' value={text} onChange={(e) => setText(e.target.value)}/>
							<button onClick={handleSendMessage}>
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' style={{width: '30px'}}>
									<path
										fill='gray'
										d='M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z'/>
								</svg>
							</button>
						</div>
					</>
				)
			}
		</div>
	)
}

export default App