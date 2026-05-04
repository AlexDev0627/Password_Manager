import * as React from 'react';
import { Avatar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const AvatarText = () => (
  <Avatar.Text size={40} style={styles.avatar} label="AD" />
);
const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#1c3992ff',
    marginTop: 16,
    marginHorizontal: 16,
  },
});
export default AvatarText;