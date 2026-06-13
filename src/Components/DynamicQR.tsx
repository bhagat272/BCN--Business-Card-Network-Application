import React from 'react';
import {View, Text} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const DynamicQR = ({user}) => {
  const qrValue = JSON.stringify({
    url: `myapp://localhost/${user?.id}`,
  });

  return (
    <View style={{alignItems: 'center', marginTop: 50}}>
      <QRCode value={`myapp://localhost/scan-qr/${user?.uuid}`} size={300} />
    </View>
  );
};

export default DynamicQR;
