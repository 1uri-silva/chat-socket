import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { on, socket } from '../../services/socket';
import Header from '../header';

type PropsListMessage = {
  id: string;
  message: string;
  username: string;
  date: Date;
};

type Props = {
  messages: PropsListMessage[];
};

type GetUserAndRoom = {
  room: string;
  name: string;
};

const ListMessages: React.FC<Props> = ({ messages }) => {
  const [user, setUser] = useState<GetUserAndRoom>({} as GetUserAndRoom);

  useEffect(() => {
    on();
    ( async () => {
      const user = await AsyncStorage.getItem('@SKUser');

      if (user) {
        const dataParsed: GetUserAndRoom = JSON.parse(user)
        setUser(dataParsed)
      } else {
        return;
      }
    }) ()
  }, []);

  const renderItem = useCallback(( { date, id, message, username }: PropsListMessage ) => {
    return (
      <>
        {username !== 'Iuri Silva' ? (
          <View style={{
            padding: 8,
            maxWidth: '90%',
            borderRadius: 8,
            backgroundColor: 'gray'
          }}>
           <Text style={{
             fontSize: 17,
             fontWeight: '500',
           }}> {message} </Text>
         </View>
        ) : (
          <View style={{
            marginLeft: '10%',
            padding: 8,
            maxWidth: '90%',
            borderRadius: 8,
            backgroundColor: 'green'
          }} >
           <Text style={{
             fontSize: 17,
             fontWeight: '500',
             textAlign: 'right'
           }}> {message} </Text>
          </View>
        )}
      </>
      )
  }, []);

  const Separator = () => (
    <View style={{
      height: 10,
      width: '100%',
      marginTop: 10,
      marginBottom: 10,
    }} />
  );

  return (
    <FlatList
      data={messages}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => renderItem(item)}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={<Header name={user.name}/>}
      contentContainerStyle={{
        padding: 12,
      }}
    />
  );
};

export default ListMessages;