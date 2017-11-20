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

import BlocklyScreen from "./BlocklyScreen";

export default class LogicScreen extends Component<{}> {
  state = {
    showBlocklyScreen: false,
    xml: "",
    logicKey: "",
    states: this.props.states
  };
  _renderBlocklyScreen() {
    if (!this.state.showBlocklyScreen) return null;
    return (
      <View style={styles.overlay}>
        <BlocklyScreen
          logicKey={this.state.logicKey}
          xml={this.state.xml}
          onBack={() => this.setState({ showBlocklyScreen: false })}
          onSave={(logicKey, code, xml) => {
            this.setState({
              showBlocklyScreen: false
            });
            this.props.onSaveLogic(logicKey, code, xml);
          }}
          states={this.state.states}
        />
      </View>
    );
  }
  render() {
    const eventKeys = Object.keys(this.props.logics);
    const events = eventKeys.map(key => {
      return this.props.logics[key];
    });
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Events</Text>
            <TouchableOpacity style={styles.buttonAdd}>
              <Image
                style={styles.buttonAddIcon}
                source={require("AppSense/assets/add.png")}
              />
            </TouchableOpacity>
          </View>
          {events.map((event, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={styles.item}
                onPress={() =>
                  this.setState({
                    showBlocklyScreen: true,
                    xml: event.xml,
                    logicKey: event.name
                  })}
              >
                <View style={styles.itemWrapper}>
                  <View style={styles.itemIconWrapper}>
                    <View style={styles.itemIcon} />
                  </View>
                  <View style={styles.item}>
                    <Text style={styles.itemTitleText}>{event.name}</Text>
                    <Text style={styles.itemDescText}>{event.description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* <TouchableOpacity style={styles.item}>
            <View style={styles.itemWrapper}>
              <View style={styles.itemIconWrapper}>
                <View style={styles.itemIcon} />
              </View>
              <View style={styles.item}>
                <Text style={styles.itemTitleText}>Button 1: onPress</Text>
                <Text style={styles.itemDescText}>Button 1 onPress event.</Text>
              </View>
            </View>
          </TouchableOpacity> */}
        </ScrollView>
        {this._renderBlocklyScreen()}
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
