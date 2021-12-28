import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/header';
import { on, off, socket } from '../../services/socket';

type SaveUserAndRoom = {
  room: string;
  name: string;
};

type Messages = {
  id: string;
  date: Date;
  room: string;
  message: string;
  username: string;
};

const Rooms: React.FC = () => {

  const rooms = [
    {
      id: '1',
      name: 'Sala 1',
    },
    {
      id: '2',
      name: 'Sala 2',
    },
    {
      id: '3',
      name: 'Sala 3',
    },
  ];

  const { navigate } = useNavigation();

  const [room, setRoom] = useState(rooms[0].name);
  const [name, setName] = useState('');
  const [messages, setMessages] = useState<Messages[]>([]);

  useEffect(() => {
    on();
  }, []);

  const createAndSaveUser = useCallback(async (data: SaveUserAndRoom) => {
    if(!data.name || data.name.length <= 0) {
      Alert.alert('Atenção', 'Insira um nome');
    } else {
      try {
        await AsyncStorage.setItem('@SKUser', JSON.stringify(data));
        socket.emit('users_room', data, (response: Messages[]) => setMessages(response) );

        // erro ao selecionar a sala
        navigate('Chat' as never, { messages } as never);

      } catch (error) {
        console.log(error);
      }
    }
  }, [messages]);

  return (
    <>
      <Header name={room}/>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          padding: 8,
          justifyContent: 'center',
        }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
            }}
          >
            Escolha uma sala
          </Text>
        <Picker
          selectedValue={room}
          onValueChange={itemValue => setRoom(String(itemValue))}
        >
          {rooms.map((item) => (
            <Picker.Item
              key={item.id}
              label={item.name}
              value={item.name}
            />
          ))}
        </Picker>

        <View style={{
          flexDirection: 'row',
        }}>
          <TextInput
            placeholder='Escolha um nome'
            placeholderTextColor='#000'
            onChangeText={value => setName(value)}
            style={{
              padding: 10,
              backgroundColor: 'gray',
              height: 60,
              color: '#000',
              width: '80%',
              borderRadius: 8
            }}
            />

            <TouchableOpacity
              onPress={() => {
                createAndSaveUser({ room, name });
                // off();
              }}
              style={{
                backgroundColor: 'green',
                height: 60,
                width: 70,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#fff'
                }}
              >
                Ok
              </Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

export default Rooms;