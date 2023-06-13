import './App.css';
import React, { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore';
import 'firebase/analytics';

//firebase hooks for getting user variable
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({

  //your configuration here

  apiKey: "AIzaSyAtoq9vBLzWhVJqIbt-H4px9PIEDPELRG0",
  authDomain: "chat-app-acbdb.firebaseapp.com",
  projectId: "chat-app-acbdb",
  databaseURL: "https:/chat-app-acbdb.firebaseio.com",
  storageBucket: "chat-app-acbdb.appspot.com",
  messagingSenderId: "584911858008",
  appId: "1:584911858008:web:2f87de6b846043d83f9d2d",
  measurementId: "G-NF0EE95JC1"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  // tell about user or not
  const [user] = useAuthState(auth);


  return (
    <div className="App">
      <header>
        <h1>let's talk</h1>
        <SignOut/>
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

// components of our chat-app

//----------------------------------------------signin------------------------------------------------------------------------


function SignIn(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <>
    <button className='sign-in' onClick={signInWithGoogle}>Sign In with Google</button>
    <p>let's talk and have fun !!! get to know people around you</p>
    </>
  )

}



//----------------------------------------------signout------------------------------------------------------------------------


function SignOut(){

  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut}>Sign Out</button>
  )

}


//----------------------------------------------chatroom-----------------------------------------------------------------------


function ChatRoom(){

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(999);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
     
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL

    })

    setFormValue('');
    dummy.current?.scrollIntoView({behavior: 'smooth'});
  }

  return(
    <>

    {messages && messages.map(msg => <ChatMessage key ={msg.id} message={msg} />)}


     <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='please say something....' />
      <button type='submit' disabled ={!formValue}>send</button>
     </form>

    </>
  )
 
}


function ChatMessage(props){
 const {text,uid,photoURL} = props.message;

 // i will be defining the class send and received

 const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

 return(
  <>
  <div className={`message ${messageClass}`}>
    <img src={photoURL}  />
    <p>{text}</p>

  </div>
  </>
 )
}



export default App;
