import { Image, StyleSheet, Text, TouchableOpacity, View, Modal, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NextButton } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

const GameScreen = ({ route }) => {

    const [sentence, setSentence] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const navigation = useNavigation();

    const { type, player } = route.params;


    const generateSentence = async () => {
        const mode = await AsyncStorage.getItem('mode');

        let tempSentence = '';

        // Call the API endpoint to retrieve the sentence based on the mode
        // try {
        //     const response = await fetch(`http://localhost:3000/sentence?mode=${mode}`);
        //     const data = await response.json();

        //     // Extract the sentence from the API response
        //     tempSentence = data.sentence;
        // } catch (error) {
        //     console.error('Error while fetching sentence from API:', error);
        // }

        // If the API call fails or the sentence is not available, use a default sentence
        if (!tempSentence) {
            tempSentence = 'Décris avec des détails exagérés comment tu séduirais Y en utilisant uniquement des objets du quotidien.';
        }
        let players = await getPlayer();

        if (tempSentence.includes(' Y ')) {
            players = players.filter(p => p.gender === player.interactWith && p.name !== player.name);
            if (players.length === 0) {
                players = await getPlayer();
                players = players.filter(p => p.name !== player.name);
            }
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            tempSentence = tempSentence.replace(' Y ', ' ' + randomPlayer.name.trim() + ' ');
        }

        if (tempSentence.includes(' X ')) {
            tempSentence = tempSentence.replace(' X ', ' ' + player.name.trim() + ' ');
        }
        return tempSentence;
    }

    const getPlayer = async () => {
        try {
            // Charger les joueurs depuis AsyncStorage
            const storedPlayers = await AsyncStorage.getItem('players');

            const players = storedPlayers != null ? JSON.parse(storedPlayers) : [];

            return players;

        } catch (error) {
            console.error('Erreur lors du chargement des joueurs depuis AsyncStorage :', error);
        }
    };


    useEffect(() => {
        let sentence = generateSentence();
        sentence.then((value) => {
            setSentence(value);
            if (soundEnabled) {
                //Speech.speak(player.name + ' : ' + value, { language: 'fr' });
            }
        });

        return () => {
            if (soundEnabled) {
                Speech.stop();
            }
        };
    }, [soundEnabled]);

    useEffect(() => {
        const restoreSoundEnabled = async () => {
            try {
                const storedSoundEnabled = await AsyncStorage.getItem('soundEnabled');
                if (storedSoundEnabled !== null) {
                    setSoundEnabled(JSON.parse(storedSoundEnabled));
                }
            } catch (error) {
                console.error('Error while restoring soundEnabled from cache:', error);
            }
        };

        restoreSoundEnabled();
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: type === 'dare' ? COLORS.lightRed : COLORS.lightBlue }]}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Ionicons name='close' size={30} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>C'est une {type === 'dare' ? 'action' : 'vérité'}</Text>

                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name='settings-outline' size={30} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <Image source={require('../assets/images/truth-or-dare.png')} style={styles.image} />

            <Text style={styles.playerName}>Pour {player.name} :</Text>

            <Text style={styles.sentence}>{sentence}</Text>

            <NextButton onPress={() => navigation.navigate('TruthOrDare')} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>

                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButton}>Fermer</Text>
                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => navigation.navigate('SelectMode')}>
                            <Text style={styles.changeModeButton}>Changer le mode</Text>
                        </TouchableOpacity>

                        <View style={styles.switchContainer}>
                            <Text style={styles.switchText}>LECTURE DES PHRASES</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={soundEnabled ? "#f5dd4b" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(value) => {
                                    setSoundEnabled(value);
                                    AsyncStorage.setItem('soundEnabled', value.toString());
                                }}
                                value={soundEnabled}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}

GameScreen.propTypes = {
    route: PropTypes.object
}

export default GameScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    image: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        margin: 50
    },
    playerName: {
        color: '#e5e5e5',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sentence: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        padding: 20,
        lineHeight: 30
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    modalButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'blue',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    switchText: {
        fontSize: 16,
        marginRight: 10
    },
    changeModeButton: {
        backgroundColor: COLORS.blue,
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginVertical: 20,
        color: 'white',
        fontSize: 18,
    }
})