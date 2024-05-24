"use client";
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input } from 'antd';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

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

    const generateRandomValue = () => {
        const min = 60;
        const max = 100;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const generateRandomPressure = () => {
        const min = 80;
        const max = 120;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getColorForPressure = (pressure) => {
        if (pressure < 90) {
            return 'red'; // Pressão baixa
        } else if (pressure >= 90 && pressure <= 120) {
            return 'green'; // Pressão normal
        } else {
            return 'orange'; // Pressão alta
        }
    };

    const getColorForHeartRate = (heartRate) => {
        if (heartRate < 60) {
            return 'red'; // Batimentos cardíacos baixos
        } else if (heartRate >= 60 && heartRate <= 100) {
            return 'green'; // Batimentos cardíacos normais
        } else {
            return 'orange'; // Batimentos cardíacos acima do normal
        }
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
            heartRate: generateRandomValue(),
            pressure: generateRandomPressure(),
        });

        setIsModalOpen(false);
        fetchPatients();
        setName('');
        setRg('');
        setCpf('');
        setAge('');
        setAddress('');
        setPhone('');
        setDescription('');
    };

    const handleCancel = () => {
        setName('');
        setRg('');
        setCpf('');
        setAge('');
        setAddress('');
        setPhone('');
        setDescription('');
        setIsModalOpen(false);
    };

    const handleDelete = async id => {
        await deleteDoc(doc(db, 'patients', id));
        fetchPatients();

    };

    const columns = [
        { title: 'Nome', dataIndex: 'name', key: 'name' },
        { title: 'RG', dataIndex: 'rg', key: 'rg' },
        { title: 'CPF', dataIndex: 'cpf', key: 'cpf' },
        { title: 'Idade', dataIndex: 'age', key: 'age' },
        { title: 'Endereço', dataIndex: 'address', key: 'address' },
        { title: 'Número', dataIndex: 'phone', key: 'phone' },
        { title: 'Descrição', dataIndex: 'description', key: 'description' },
        {
            title: 'Pressão',
            dataIndex: 'pressure',
            key: 'pressure',
            render: (text, record) => (
                <span style={{ background: getColorForPressure(record.pressure), color: 'black', padding: 12, borderRadius:12, }}>{record.pressure}</span>
            ),
        },
        {
            title: 'Batimentos Cardíacos',
            dataIndex: 'heartRate',
            key: 'heartRate',
            render: (text, record) => (
                <span style={{ color: "black", background:getColorForHeartRate(record.heartRate), padding: 12, borderRadius:12, }}>{record.heartRate}</span>
            ),
        },
        {
            title: 'Ações',
            key: 'action',
            render: (text, record) => (
                <Button className="delete" type="link" onClick={() => handleDelete(record.id)}>
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div className="estoqueP">
            <div className="titulo">Pacientes</div>
            <Table columns={columns} dataSource={patients} rowKey="id"/>

            <Button className="buttonModal" type="primary" onClick={showModal}>
                Adicionar Paciente
            </Button>

            <Modal className="modalA" title="Adicionar Paciente" visible={isModalOpen} onOk={handleOk}
                   onCancel={handleCancel}>
                <Input className="modalInput" placeholder="Nome" value={name} onChange={e => setName(e.target.value)}/>
                <Input className="modalInput" placeholder="RG" value={rg} onChange={e => setRg(e.target.value)}/>
                <Input className="modalInput" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)}/>
                <Input className="modalInput" placeholder="Idade" type="number" value={age}
                       onChange={e => setAge(e.target.value)}/>
                <Input className="modalInput" placeholder="Endereço" value={address}
                       onChange={e => setAddress(e.target.value)}/>
                <Input className="modalInput" placeholder="Número" value={phone}
                       onChange={e => setPhone(e.target.value)}/>
                <Input.TextArea className="modalInput" placeholder="Descrição" value={description}
                                onChange={e => setDescription(e.target.value)}/>
            </Modal>
        </div>
    );
};

export default PatientApp;
