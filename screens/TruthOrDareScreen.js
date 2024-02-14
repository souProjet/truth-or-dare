import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { COLORS } from '../constants/theme'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';


const TruthOrDareScreen = () => {
    const [selectedPlayer, setSelectedPlayer] = useState('')

    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
          
            loadPlayers();
        }, [])
    );

    useEffect(() => {
        // Charger les joueurs depuis AsyncStorage lors du montage du composant
        loadPlayers();
    }, []); // Le tableau vide signifie que cela s'exécute une seule fois lors du montage du composant

    const loadPlayers = async () => {
        try {
            // Charger les joueurs depuis AsyncStorage
            const storedPlayers = await AsyncStorage.getItem('players');

            const players = storedPlayers != null ? JSON.parse(storedPlayers) : [];
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            setSelectedPlayer(randomPlayer);
            
        } catch (error) {
            console.error('Erreur lors du chargement des joueurs depuis AsyncStorage :', error);
        }
    };

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <TouchableOpacity style={styles.dareContainer} onPress={() => navigation.navigate({ name: 'Game', params: { type: 'dare', player: selectedPlayer } })}>
                <Text style={styles.dareText}>ACTION</Text>
            </TouchableOpacity>
           
            <TouchableOpacity style={styles.truthContainer} onPress={() => navigation.navigate({ name: 'Game', params: { type: 'truth', player: selectedPlayer } })}>
                <Text style={styles.truthText}>VÉRITÉ</Text>
            </TouchableOpacity>

            <View style={styles.overlayContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{selectedPlayer.name}</Text>
                </View>
            </View>
        </View>
    )
}

export default TruthOrDareScreen

const styles = StyleSheet.create({
    truthContainer: {
        flex: 1,
        backgroundColor: COLORS.lightBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: 'white'
    },
    truthText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    dareContainer: {
        flex: 1,
        backgroundColor: COLORS.lightRed,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'white'
    },
    dareText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameContainer: {
        backgroundColor: COLORS.white,
        padding: 20,
        paddingHorizontal: 40,
        borderRadius: 10,
        transform: [{ rotate: '-5deg' }]
    },
    nameText: {
        color: COLORS.darkBlue,
        fontSize: 25,
        fontWeight: 'bold',
    }
})