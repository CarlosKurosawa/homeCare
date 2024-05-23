"use client"
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBPvNcqQGNwb_pb5cE75vQxRSF02k7GkEA",
    authDomain: "chat-react-8abd8.firebaseapp.com",
    projectId: "chat-react-8abd8",
    storageBucket: "chat-react-8abd8.appspot.com",
    messagingSenderId: "93583843710",
    appId: "1:93583843710:web:e39c656a3108cde0a0132f"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [selectedChat, setSelectedChat] = useState('chat1');
    const userId = 'Farmaceutico';

    const messagesRef = db.collection('messages');
    const query = messagesRef.where('chatId', '==', selectedChat).orderBy('createdAt').limit(25);
    const [queriedMessages, loading, error] = useCollectionData(query, { idField: 'id' });

    useEffect(() => {
        console.log('Queried Messages:', queriedMessages);
        if (queriedMessages) {
            setMessages(queriedMessages);
        }
    }, [queriedMessages]);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (text.trim() === '') {
            return; // Não envia mensagens vazias
        }

        try {
            await messagesRef.add({
                text,
                userId,
                chatId: selectedChat,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Message sent:', text);
            setText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleChatChange = (chatId) => {
        setSelectedChat(chatId);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="chat">
            <div className="contatos">
                <div className="titulo">Pacientes</div>
                <button className="paciente" onClick={() => handleChatChange('chat1')}>Paciente - José Bezerra</button>
                <button className="paciente" onClick={() => handleChatChange('chat2')}>Paciente - Isabela Santos</button>
                <button className="paciente" onClick={() => handleChatChange('chat3')}>Paciente - Pedro Pereira</button>
            </div>
            <div className="chatPart">
                <div className="chat-messages">
                    {messages && messages.map((message) => (
                        <div key={message.id}
                             className={message.userId === userId ? 'own-messageBox' : 'other-messageBox'}>
                            <div className={message.userId === userId ? 'own-message' : 'other-message'}>
                                {message.userId === userId ? 'Farmaceutico' : 'Paciente'}
                                <div> {message.text}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <form onSubmit={sendMessage}>
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Digite uma mensagem"
                        />
                        <button type="submit">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chat;
