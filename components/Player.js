import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';


const Player = ({ name, gender, interactWith, onDelete, onEdit }) => {
    return (
        <View style={styles.player}>
            <TouchableOpacity style={styles.playerLeft} onPress={onEdit}>
                <Ionicons name={gender} size={24} color={gender == 'male' ? COLORS.blue : COLORS.red} style={styles.icon} />
                <View style={styles.playerInfo}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.interactWith}>
                        Intéraction avec des {interactWith == 'male' ?
                            <Text style={{ color: COLORS.blue }}>hommes</Text> :
                            <Text style={{ color: COLORS.red }}>femmes</Text>}

                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
                <Ionicons name="trash-outline" size={24} color={COLORS.red} style={styles.icon} />
            </TouchableOpacity>
        </View>
    )
}

Player.propTypes = {
    name: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    interactWith: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default Player

const styles = StyleSheet.create({
    player: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    playerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    playerInfo: {
        flexDirection: 'column',
        width: '80%'
    },
    icon: {
        marginRight: 15,
    },
    name: {
        fontFamily: 'medium',
        fontSize: 20,
        maxWidth: '80%'
    },
    interactWith: {
        fontFamily: 'regular',
        fontSize: 15,
        color: COLORS.gray
    }
})