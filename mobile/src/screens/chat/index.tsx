import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ListMessages from '../../components/list-messages';
import { on, sendMessage, socket } from '../../services/socket';

type Messages = {
  id: string;
  date: Date;
  message: string;
  room: string;
  username: string;
};

type Params = {
  params: {
    messages: Messages[],
  }
};

const Chat: React.FC = () => {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Messages[]>([])

  const { params } = useRoute() as Params;

  useEffect(() => {
    on();
  }, []);

  useEffect(() => {
    setMessages(params.messages)
  }, [params]);

  const send = useCallback( async () => {
    const userData = await AsyncStorage.getItem('@SKUser');

    if(userData) {
      const user = JSON.parse(userData);

      const data = {
        message,
        room: user.room,
        date: new Date(),
        username: user.name,
        id: Math.random().toFixed(2),
      };

      sendMessage(data);
    };

  }, [message]);

  socket.on('message', message => {
    setMessages([...messages, message])
  });

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ListMessages messages={messages}/>

    <View style={{ flexDirection: 'row' }}>

      <TextInput 
        value={message}
        placeholder='Digite uma mensagem'
        placeholderTextColor='#fff'
        onChangeText={e => setMessage(e) }
        style={{
          width: '80%',
          height: 55,
          padding: 9,
          color: '#fff',
          borderRadius: 8,
          backgroundColor: 'blue'
        }}
      />

      <TouchableOpacity 
        style={{
          backgroundColor: 'green',
          height: 55,
          width: 60,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center'
        }}

        onPress={() => {
          if(message.length < 0 || message === '') {
            Alert.alert('Aviso', 'Digite algo antes');
          } else {
            send();
            setMessage('');
          }
        }}
      >
        <Text>
          Ok
        </Text>
      </TouchableOpacity>
    </View>

    </View>
  );
}

export default Chat;