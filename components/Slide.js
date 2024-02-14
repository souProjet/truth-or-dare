import { StyleSheet, Text, View, Image, useWindowDimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme';
import PropTypes from 'prop-types'
import { useNavigation } from '@react-navigation/native';

const Slides = ({ item }) => {
    const { width } = useWindowDimensions()
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { width }]}>
            <Image source={item.image} style={[styles.image, { width, resizeMode: 'contain' }]} />
            <View style={{ flex: 0.25, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>MODE </Text>
                <Text style={{ ...styles.title, color: item.color}}>{item.mode}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TruthOrDare')}>
                <Text style={styles.buttonText}>Sélectionner</Text>
            </TouchableOpacity>
        </View>
    );
}

Slides.propTypes = {
    item: PropTypes.object.isRequired,
}

export default Slides

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 0.7,
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 28,
        marginBottom: 10,
        color: COLORS.lightBlue,
        textAlign: 'center',
    },
    button: {
        flex: 0.05,
        backgroundColor: COLORS.lightBlue,
        paddingVertical: 15,
        paddingHorizontal: 80,
        borderRadius: 25,
        marginBottom: 60,
        alignSelf: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 20,
    }

})