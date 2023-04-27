import React, { useEffect, useState } from 'react';
import './App.css';
import { Input, Space, Button, List, Spin, Result } from 'antd';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

const sock = new SockJS('http://192.168.1.102:8080/exchangeData/');

const client = Stomp.over(sock);


const App = () => {
  const [message, setMessage] = useState('');
  const [answers, setAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isServerConnectionFailed, setIsServerConnectionFailed] = useState(false);
  useEffect(() => {
    client.connect({}, (frame) => {
      setIsLoading(false);
      client.subscribe("/ws/pong", (payload) => {
        setAnswers((answers) => [...answers, JSON.parse(payload.body).message]);
      });
    }, () => {
      setIsServerConnectionFailed(true);
    });
  }, []);

  const handleSend = () => {
    client.send("/app/ping", {}, JSON.stringify({ message: message }));
  }

  if (isServerConnectionFailed) {
    <Result
      status="error"
      title="Игорь подыми серв"
      subTitle="Бля буду работает"
    />
  }
  return (
    <Spin spinning={isLoading} delay={500}>
      <Space>
        <Input placeholder="Basic usage" value={message} onChange={(e) => setMessage(e.target.value)}/>
        <Button type="primary" onClick={handleSend}>Submit</Button>
      </Space>
      <List
        size="large"
        bordered
        dataSource={answers}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Spin>
  );
}

export default App;
