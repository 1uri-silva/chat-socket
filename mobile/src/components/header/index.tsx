import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  name: string;
};

const Header: React.FC<Props> = ({
  name
}) => {
  return (
    <View style={{
      height: 50,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between'
    }}>
      <Text></Text>
      <Text style={{
        fontSize: 21,
        fontWeight: '500',
      }}>{name}</Text>
      <Text></Text>
    </View>
  );
}

export default Header;