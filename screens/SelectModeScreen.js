import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, Animated, FlatList } from 'react-native'
import { Slide, Paginator } from '../components'
import { COLORS } from '../constants/theme'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectModeScreen = () => {
    const [itemSize, setItemSize] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current
    const slidesRef = useRef(null)

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        storeData(viewableItems[0].item.mode)
    }).current;


    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('mode', value)
        }
        catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem('mode');
                if (value !== null) {
                    const index = slides.findIndex(slide => slide.mode === value);
                    setTimeout(() => {
                        slidesRef.current.scrollToIndex({ index });
                    }, 100);
                }
            } catch (e) {
                console.log(e);
            }
        }

        getData();
    }, []);

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const slides = [
        {
            id: 1,
            image: require('../assets/images/family.png'),
            mode: "FAMILLE",
            color: '#9dcdfa',
        },
        {
            id: 2,
            image: require('../assets/images/fun.png'),
            mode: "FUN",
            color: '#db9efa',
        },
        {
            id: 3,
            image: require('../assets/images/soft.png'),
            mode: "SOFT",
            color: '#999',
        },
        {
            id: 4,
            image: require('../assets/images/couple.png'),
            mode: "COUPLE",
            color: COLORS.lightRed
        },
        {
            id: 5,
            image: require('../assets/images/hot.png'),
            mode: "HOT",
            color: COLORS.red
        },
    ]
    
    return (
        <View style={styles.container}>
            <View style={{ flex: 3 }}>
                <FlatList
                    onLayout={event => {
                        if (itemSize === 0 && event.nativeEvent.layout.width !== 0) {
                          setItemSize(event.nativeEvent.layout.width);
                        }
                      }}
                    ref={slidesRef}
                    data={slides}
                    renderItem={({ item }) => <Slide item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    getItemLayout={(data, index) => ({
                        length: itemSize,
                        offset: itemSize * index,
                        index,
                    })}
                    onScrollToIndexFailed={info => {
                        const wait = new Promise(resolve => setTimeout(resolve, 500));
                        wait.then(() => {
                            slidesRef.current?.scrollToIndex({ index: info.index, animated: true });
                        });
                    }}
                />
            </View>

            <Paginator data={slides} scrollX={scrollX} />

        </View>
    )
}

export default SelectModeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifiyContent: 'center',
        alignItems: 'center',
    },
})