import React from 'react';
import {View} from 'react-native';

const Spacer = ({space = 10}: {space?: number}) => {
  return (
    <View style={{flexDirection: 'row', height: !!space ? space : 10}}></View>
  );
};

export default Spacer;
