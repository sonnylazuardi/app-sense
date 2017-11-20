/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  Dimensions
} from "react-native";
import MainApp from "./MainApp";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from './SliderEntry';


const ENTRIES1 = [
    {
        title: 'Beautiful and dramatic Antelope Canyon',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: require('AppSense/assets/bg1.jpg'),
        navigateTo: 'MainApp'
    },
    {
        title: 'Earlier this morning, NYC',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: require('AppSense/assets/bg2.jpg'),
        navigateTo: 'MainApp'
    },
    {
        title: 'White Pocket Sunset',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        illustration: require('AppSense/assets/bg3.jpg'),
        navigateTo: 'MainApp'
    },
    {
        title: 'Acrocorinth, Greece',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: require('AppSense/assets/bg4.jpg'),
        navigateTo: 'MainApp'
    },
    {
        title: 'The lone tree, majestic landscape of New Zealand',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: require('AppSense/assets/bg5.jpg'),
        navigateTo: 'MainApp'
    },
];


export default class App extends Component<{}> {

    static navigationOptions = {
        headerTitle: (
            <Image source={require("AppSense/assets/logo.png")} style={{height: 50, width: 50, alignSelf:'center'}}/>
        ),
        headerStyle: {
            backgroundColor: '#075e9b'
        }
    }

    constructor (props) {
        super(props);
        this.state = {
            slider1ActiveSlide: 1,
            slider1Ref: null
        };
    }

    _renderItemWithParallax = ({item, index}, parallaxProps) => {
        const { navigate } = this.props.navigation;
        return (
            <SliderEntry
              data={item}
              even={true}
              parallax={true}
              parallaxProps={parallaxProps}
              onPress={() => { navigate(item.navigateTo); }}
            />
        );
    }

    render () {
        const { navigate } = this.props.navigation;
        const { slider1ActiveSlide, slider1Ref } = this.state;

        return (
            <View style={styles.container}>
                {/* <Text style={{marginTop:50}}>
                    Welcome
                </Text> */}
                {/* <TouchableHighlight onPress={() => navigate('MainApp') } style={{height:50, flexDirection: 'row', justifyContent: 'center',backgroundColor: '#ddd'}}>
                    <Text style={{fontSize:20}}>Sign In</Text>
                </TouchableHighlight> */}
                <ScrollView
                  style={styles.scrollview}
                  contentContainerStyle={styles.scrollviewContentContainer}
                  indicatorStyle={'white'}
                  scrollEventThrottle={200}
                  directionalLockEnabled={true}
                >
                    <Carousel
                        ref={(c) => { if (!this.state.slider1Ref) { this.setState({ slider1Ref: c }); } }}
                        data={ENTRIES1}
                        renderItem={this._renderItemWithParallax}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        hasParallaxImages={true}
                        firstItem={1}
                        inactiveSlideScale={0.94}
                        inactiveSlideOpacity={0.7}
                        enableMomentum={false}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        loop={true}
                        loopClonesPerSide={2}
                        autoplay={false}
                        onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                        />
                    <Pagination
                        dotsLength={ENTRIES1.length}
                        activeDotIndex={slider1ActiveSlide}
                        containerStyle={styles.paginationContainer}
                        dotColor={'rgba(255, 255, 255, 0.92)'}
                        dotStyle={styles.paginationDot}
                        inactiveDotColor={'#000'}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        carouselRef={slider1Ref}
                        tappableDots={!!slider1Ref}
                    />
                </ScrollView>

            </View>
        );
    }
};


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.4;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;
var styles = StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },
    imageContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    imageContainerEven: {
        backgroundColor: '#000'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on ios; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: '#000'
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: '#000'
    },
    title: {
        color: '#000',
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: '#888888',
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    },
    container: {
        flex: 1,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1,
        paddingTop: 30
    },
    scrollviewContentContainer: {
        paddingBottom: 0
    },
    exampleContainer: {
        marginBottom: 30
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    slider: {
        marginTop: 25
    },
    sliderContentContainer: {
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    }
});