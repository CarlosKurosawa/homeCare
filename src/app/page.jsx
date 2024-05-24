"use client";
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, DatePicker, Select } from 'antd';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';

const { Option } = Select;

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

const AppointmentScheduler = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [datetime, setDatetime] = useState(null);
  const [appointmentType, setAppointmentType] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const appointmentsCollection = await getDocs(collection(db, 'appointments'));
    const fetchedAppointments = appointmentsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAppointments(fetchedAppointments);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await addDoc(collection(db, 'appointments'), {
      patientName,
      doctorName,
      datetime: datetime.toDate(),
      appointmentType,
      description,
    });

    setIsModalOpen(false);
    setPatientName('');
    setDoctorName('');
    setDatetime(null);
    setAppointmentType('');
    setDescription('');
    fetchAppointments();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPatientName('');
    setDoctorName('');
    setAppointmentType('');
    setDatetime(null);
    setDescription('');
  };

  const handleDelete = async id => {
    await deleteDoc(doc(db, 'appointments', id));
    fetchAppointments();
  };

  const columns = [
    { title: 'Solicitante', dataIndex: 'patientName', key: 'patientName' },
    { title: 'Responsável', dataIndex: 'doctorName', key: 'doctorName' },
    { title: 'Tipo', dataIndex: 'appointmentType', key: 'appointmentType' },

    { title: 'Descrição', dataIndex: 'description', key: 'description' },
    {
      title: 'Ação',
      key: 'action',
      render: (text, record) => (
          <Button className="delete" type="link" onClick={() => handleDelete(record.id)}>
            Deletar
          </Button>
      ),
    },
    {
      title: 'Data & Hora',
      dataIndex: 'datetime',
      key: 'datetime',
      render: datetime => format(datetime.toDate(), 'yyyy-MM-dd HH:mm'),
    },
  ];

  return (
      <div>
        <div className="estoqueP">
          <div className="titulo">Agenda</div>
          <Table columns={columns} dataSource={appointments} rowKey="id" />

          <Button className="buttonModal" type="primary" onClick={showModal}>
            Adicionar
          </Button>

          <Modal title="Agenda" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Input
                className="modalInput"
                placeholder="Solicitante"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
            />
            <Input
                className="modalInput"
                placeholder="Responsável"
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
            />
            <Select
                className="modalInput"
                placeholder="Selecionar Tipo"
                value={appointmentType}
                onChange={value => setAppointmentType(value)}
                style={{ width: '100%' }}
            >
              <Option value="Evento">Evento</Option>
              <Option value="Consulta">Consulta</Option>
              <Option value="Outro">Outro</Option>
            </Select>
            <Input.TextArea
                className="modalInput"
                placeholder="Descrição"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <DatePicker
                className="modalInput"
                showTime
                placeholder="Selecionar Data e Hora"
                value={datetime}
                onChange={value => setDatetime(value)}
            />
          </Modal>
        </div>
      </div>
  );
};

export default AppointmentScheduler;
