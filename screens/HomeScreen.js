import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Player, StartGameButton } from '../components';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {

    const [players, setPlayers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerIsMale, setNewPlayerIsMale] = useState(true);
    const [newPlayerInteractWithIsMale, setNewPlayerInteractWithIsMale] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        // Charger les joueurs depuis AsyncStorage lors du montage du composant
        loadPlayers();
    }, []); // Le tableau vide signifie que cela s'exécute une seule fois lors du montage du composant

    const loadPlayers = async () => {
        try {
            // Charger les joueurs depuis AsyncStorage
            const storedPlayers = await AsyncStorage.getItem('players');

            // Mettre à jour l'état local avec les joueurs chargés
            if (storedPlayers) {
                setPlayers(JSON.parse(storedPlayers));
            }
        } catch (error) {
            console.error('Erreur lors du chargement des joueurs depuis AsyncStorage :', error);
        }
    };

    const savePlayers = async (playersToSave) => {
        try {
            // Enregistrer les joueurs dans AsyncStorage
            await AsyncStorage.setItem('players', JSON.stringify(playersToSave));
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des joueurs dans AsyncStorage :', error);
        }
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const createOrUpdatePlayer = (player = null) => {
        const playerData = {
            id: player ? player.id : uuid.v4(),
            name: newPlayerName,
            gender: newPlayerIsMale ? 'male' : 'female',
            interactWith: newPlayerInteractWithIsMale ? 'male' : 'female',
        };

        return playerData;
    };

    const handleAddOrEditPlayer = () => {

        // Vérifier que le prénom du joueur n'est pas vide
        if (!newPlayerName.trim()) {
            setErrorMessage('Veuillez entrer un prénom');
            return;
        }

        // Vérifier que le prénom du joueur n'est pas déjà utilisé
        const doesPlayerExist = players.some((player) => player.name === newPlayerName);
        if (doesPlayerExist) {
            setErrorMessage('Un joueur avec ce prénom existe déjà, trouvez-lui un surnom ^^');
            return;
        }

        // Vérifier que le nombre de joueurs n'est pas supérieur à 10
        if (players.length >= 10) {
            setErrorMessage('Vous avez atteint le nombre maximum de joueurs');
            return;
        }


        let newPlayers;
        if (editingPlayer) {
            // Update existing player
            newPlayers = players.map((player) =>
                player.id === editingPlayer.id ? createOrUpdatePlayer(player) : player
            );
        } else {
            // Add new player
            const newPlayer = createOrUpdatePlayer();
            newPlayers = [...players, newPlayer];
        }

        setPlayers(newPlayers);
        savePlayers(newPlayers);
        closeModal();
    };

    const handleEditPlayer = (player) => {

        setEditingPlayer(player);
        setNewPlayerName(player.name);
        setNewPlayerIsMale(player.gender === 'male');
        setNewPlayerInteractWithIsMale(player.interactWith === 'male');
        toggleModal();
    }

    const closeModal = () => {
        // Réinitialiser les champs du formulaire
        setNewPlayerName('');
        setNewPlayerIsMale(true);
        setNewPlayerInteractWithIsMale(false);
        setEditingPlayer(null);
        setErrorMessage('');

        // Fermer la modal
        toggleModal();
    };


    const handleDeletePlayer = (playerId) => {
        // Supprimer le joueur de la liste des joueurs
        const newPlayers = players.filter((player) => player.id !== playerId);
        setPlayers(newPlayers);

        // Enregistrer les joueurs dans AsyncStorage
        savePlayers(newPlayers);
    };
    return (

        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Joueurs</Text>

            <ScrollView style={styles.playerListContainer} showsVerticalScrollIndicator={false}>
                {players.length === 0 && (
                    <View style={styles.player}>
                        <Text style={{ textAlign: 'center', fontFamily: 'medium', fontSize: 20, color: COLORS.gray }}>
                            Aucun joueur pour le moment
                        </Text>
                    </View>
                )}
                {players.map((player) => (
                    <Player
                        key={player.id}
                        name={player.name}
                        gender={player.gender}
                        interactWith={player.interactWith}
                        onDelete={() => handleDeletePlayer(player.id)}
                        onEdit={() => handleEditPlayer(player)}
                    />
                ))}

                <TouchableOpacity style={styles.addPlayer} onPress={toggleModal}>
                    <Ionicons name="add" size={30} color={COLORS.green} />
                </TouchableOpacity>
            </ScrollView>

            <LinearGradient
                colors={['rgba(232, 234, 237, 0)', 'rgba(232, 234, 237, 1)']}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 80,
                    height: 100,
                    zIndex: 2,
                }}
            />


            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>

                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {errorMessage && <Text style={{ color: COLORS.red, marginBottom: 20 }}>{errorMessage}</Text>}
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Ionicons name="close" size={32} color={COLORS.gray} />
                        </TouchableOpacity>

                        <Text style={styles.modalHeaderText}>{editingPlayer ? 'Modifier le' : 'Ajouter un'} joueur</Text>
                        <TextInput
                            placeholder="Prénom"
                            style={styles.input}
                            autoFocus={true} // Autofocus activé
                            value={newPlayerName}
                            onChangeText={(text) => setNewPlayerName(text)}
                            maxLength={25}
                        />
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Sexe:</Text>
                            <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={() => setNewPlayerIsMale(!newPlayerIsMale)}
                            >
                                <Ionicons
                                    name={newPlayerIsMale ? 'male' : 'female'}
                                    size={24}
                                    color={newPlayerIsMale ? COLORS.blue : COLORS.red}
                                />
                            </TouchableOpacity>
                            <Text
                                style={{ color: newPlayerIsMale ? COLORS.blue : COLORS.red }}
                            >{newPlayerIsMale ? 'Homme' : 'Femme'}</Text>
                        </View>

                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Intéraction avec des :</Text>
                            <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={() => setNewPlayerInteractWithIsMale(!newPlayerInteractWithIsMale)}
                            >
                                <Ionicons
                                    name={newPlayerInteractWithIsMale ? 'male' : 'female'}
                                    size={24}
                                    color={newPlayerInteractWithIsMale ? COLORS.blue : COLORS.red}
                                />
                            </TouchableOpacity>
                            <Text
                                style={{ color: newPlayerInteractWithIsMale ? COLORS.blue : COLORS.red }}
                            >{newPlayerInteractWithIsMale ? 'Homme' : 'Femme'}</Text>
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={handleAddOrEditPlayer}>
                            <Text style={styles.buttonText}>{editingPlayer ? 'Modifier' : 'Ajouter'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <StartGameButton onPress={() => navigation.navigate('SelectMode')} disabled={players.length < 2} />

        </SafeAreaView>

    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EAED',
    },
    headerText: {
        fontFamily: 'bold',
        fontSize: 30,
        color: '#514E5A',
        marginTop: 20,
        marginLeft: 20,
        alignSelf: 'center',
    },
    playerListContainer: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 80,
    },
    addPlayer: {
        borderWidth: 2,
        borderColor: COLORS.green,
        width: 60,
        height: 60,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 100,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    switchLabel: {
        marginRight: 10,
        fontFamily: 'bold',
        fontSize: 20,
    },
    iconContainer: {
        marginHorizontal: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    modalHeaderText: {
        fontFamily: 'bold',
        fontSize: 25,
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#DDD',
        height: 40,
        marginBottom: 30,
        paddingLeft: 10,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: COLORS.blue,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontFamily: 'bold',
        fontSize: 20,
    },
});
