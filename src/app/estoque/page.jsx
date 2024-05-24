"use client";
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input } from 'antd';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBPvNcqQGNwb_pb5cE75vQxRSF02k7GkEA",
    authDomain: "chat-react-8abd8.firebaseapp.com",
    projectId: "chat-react-8abd8",
    storageBucket: "chat-react-8abd8.appspot.com",
    messagingSenderId: "93583843710",
    appId: "1:93583843710:web:e39c656a3108cde0a0132f"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // se já estiver inicializado, use essa instância
}

const db = firebase.firestore();

const StockApp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stockItems, setStockItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemSupplier, setItemSupplier] = useState('');
    const [itemDescription, setItemDescription] = useState('');

    useEffect(() => {
        fetchStockItems();
    }, []);

    const fetchStockItems = async () => {
        const itemsCollection = await db.collection('stock').get();
        const fetchedItems = itemsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStockItems(fetchedItems);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        await db.collection('stock').add({
            name: itemName,
            quantity: parseInt(itemQuantity),
            supplier: itemSupplier,
            description: itemDescription
        });
        setIsModalOpen(false);
        setItemName('');
        setItemQuantity('');
        setItemSupplier('');
        setItemDescription('');
        fetchStockItems();
    };

    const handleCancel = () => {
        setItemName('');
        setItemQuantity('');
        setItemSupplier('');
        setItemDescription('');
        setIsModalOpen(false);
    };

    const handleDelete = async id => {
        await db.collection('stock').doc(id).delete();
        fetchStockItems();
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Supplier', dataIndex: 'supplier', key: 'supplier' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button className="delete" type="link" onClick={() => handleDelete(record.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </Button>
            ),
        },
    ];

    return (
        <div className="estoqueP">
                <div className="titulo">Estoque da Farmacia</div>
            <Table columns={columns} dataSource={stockItems} />
            <Button className="buttonModal" type="primary" onClick={showModal}>
                Adicionar
            </Button>
            <Modal title="Adicionar item ao estoque" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input className="modalInput"   placeholder="Name" value={itemName} onChange={e => setItemName(e.target.value)} />
                <Input className="modalInput"   placeholder="Quantity" type="number" value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} />
                <Input className="modalInput"   placeholder="Supplier" value={itemSupplier} onChange={e => setItemSupplier(e.target.value)} />
                <Input.TextArea className="modalInput"  placeholder="Description" value={itemDescription} onChange={e => setItemDescription(e.target.value)} />
            </Modal>
        </div>
    );
};

export default StockApp;
