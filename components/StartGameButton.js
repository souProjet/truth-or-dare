import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import PropTypes from 'prop-types';

const StartGameButton = ({ onPress, disabled = true }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.startGameButton, { opacity: disabled ? 0.5 : 1 }]}
        onPress={onPress} 
        disabled={disabled}>
        <Ionicons name="play" size={24} color={COLORS.green} style={styles.icon} />
        <Text style={styles.buttonText}>Commencer la partie</Text>
      </TouchableOpacity>
    </View>
  );
};

StartGameButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default StartGameButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20, 
    left: 0,
    right: 0,
  },
  startGameButton: {
    backgroundColor: COLORS.blue,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontFamily: 'bold',
    fontSize: 18,
    color: '#FFF',
  },
});
