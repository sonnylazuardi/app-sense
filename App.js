/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Switch, Button } from "react-native";
import JsxParser from "./lib/jsxParser/components/JsxParser";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

export default class App extends Component<{}> {
  state = {
    counter: 1,
    htmlAmpas: `<View><Text>Apakah ampas?</Text><Text>Tes lagi dong?</Text><Switch value={true}/><Button onPress={'buttonPressed'} title="TESTING" /></View>`,
    functionAmpas: `
      alert('1');
      this.setState({
        counter: 3,
      });
      alert('2');
    `
  };
  onChangeHTML = () => {
    this.setState({
      htmlAmpas: `<Text>Saya gak ampas</Text>`
    });
  };
  evalInContext(js, context) {
    return function() {
      return eval(js);
    }.call(context);
  }
  render() {
    const { counter } = this.state;
    const buttonPressed = () => {
      this.evalInContext(this.state.functionAmpas, this);
    };
    return (
      <View style={styles.container}>
        <Text>{counter}</Text>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button title="Ganti HTML" onPress={this.onChangeHTML} />
        <JsxParser
          // bindings={{ onPress: buttonPressed }}
          callbacks={{
            buttonPressed
          }}
          components={{ Text, Switch, View, Button }}
          jsx={this.state.htmlAmpas}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
