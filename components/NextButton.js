import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import PropTypes from 'prop-types';

const NextButton = ({ onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.NextButton} onPress={onPress}>
                <Text style={styles.buttonText}>Suivant</Text>
                <Ionicons name='arrow-forward' size={30} color={COLORS.white} style={styles.icon} />
            </TouchableOpacity>
        </View>
    );
};

NextButton.propTypes = {
    onPress: PropTypes.func.isRequired,
};

export default NextButton;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
    },
    NextButton: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    icon: {
        color: COLORS.blue,
    },
    buttonText: {
        fontFamily: 'bold',
        fontSize: 25,
        marginRight: 20,
        color: COLORS.blue,
    },
});
