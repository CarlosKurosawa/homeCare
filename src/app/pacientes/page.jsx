"use client";
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input } from 'antd';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

// Substitua as credenciais abaixo pelas suas credenciais do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBPvNcqQGNwb_pb5cE75vQxRSF02k7GkEA",
    authDomain: "chat-react-8abd8.firebaseapp.com",
    projectId: "chat-react-8abd8",
    storageBucket: "chat-react-8abd8.appspot.com",
    messagingSenderId: "93583843710",
    appId: "1:93583843710:web:e39c656a3108cde0a0132f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PatientApp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [name, setName] = useState('');
    const [rg, setRg] = useState('');
    const [cpf, setCpf] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        const patientsCollection = await getDocs(collection(db, 'patients'));
        const fetchedPatients = patientsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPatients(fetchedPatients);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        await addDoc(collection(db, 'patients'), {
            name,
            rg,
            cpf,
            age: parseInt(age),
            address,
            phone,
            description,
        });

        setIsModalOpen(false);
        fetchPatients();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async id => {
        await deleteDoc(doc(db, 'patients', id));
        fetchPatients();
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'RG', dataIndex: 'rg', key: 'rg' },
        { title: 'CPF', dataIndex: 'cpf', key: 'cpf' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button className="delete" type="link" onClick={() => handleDelete(record.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </Button>
            ),
        },
    ];

    return (
        <div className="estoqueP">
            <div className="titulo">Informação de Pacientes</div>
            <Table columns={columns} dataSource={patients} rowKey="id"/>

            <Button className="buttonModal" type="primary" onClick={showModal}>
                Adicionar
            </Button>

            <Modal className="modalA" title="Adicionar paciente" visible={isModalOpen} onOk={handleOk}
                   onCancel={handleCancel}>
                <Input className="modalInput" placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>
                <Input className="modalInput" placeholder="RG" value={rg} onChange={e => setRg(e.target.value)}/>
                <Input className="modalInput" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)}/>
                <Input className="modalInput" placeholder="Age" type="number" value={age}
                       onChange={e => setAge(e.target.value)}/>
                <Input className="modalInput" placeholder="Address" value={address}
                       onChange={e => setAddress(e.target.value)}/>
                <Input className="modalInput" placeholder="Phone" value={phone}
                       onChange={e => setPhone(e.target.value)}/>
                <Input.TextArea className="modalInput" placeholder="Description" value={description}
                                onChange={e => setDescription(e.target.value)}/>
            </Modal>
        </div>
    );
};

export default PatientApp;
