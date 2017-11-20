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
  Switch,
  Button,
  TouchableOpacity,
  Animated,
  Image,
  Easing,
  ScrollView,
  Dimensions,
  TextInput
} from "react-native";

export default class StateScreen extends Component<{}> {
    state = { 
        stateName: '',
        stateInitialValue: '',
    };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(stateName) => this.setState({stateName})}
            placeholder={'State Name'}
            value={this.state.stateName}
        />
        <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(stateInitialValue) => this.setState({stateInitialValue})}
            placeholder={'State Initial Value'}
            value={this.state.stateInitialValue}
        />
        <Button
            onPress={() => {
                this.props.onCreateHandler(this.state.stateName, this.state.stateInitialValue)}
            }
            title="Create State"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
        />
        <Text>
            {JSON.stringify(this.props.states)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scroll: {
    flex: 1
  },
  divider: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15
  },
  dividerText: {
    flex: 1,
    color: "#555",
    fontWeight: "500"
  },
  buttonAdd: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonAddIcon: {
    width: 23,
    height: 23,
    tintColor: "#555"
  },
  item: {
    height: 80
  },
  itemWrapper: {
    height: 80,
    flexDirection: "row",
    alignItems: "center"
  },
  itemIconWrapper: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center"
  },
  itemIcon: {
    width: 30,
    height: 30,
    backgroundColor: "#999",
    borderRadius: 20,
    marginHorizontal: 10
  },
  item: {
    flex: 1
  },
  itemTitleText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "500"
  },
  overlay: {
    zIndex: 10,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    elevation: 5,
    backgroundColor: "#fff"
  }
});
