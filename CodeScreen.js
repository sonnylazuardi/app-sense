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
  TextInput,
  Linking
} from "react-native";

import SyntaxHighlighter from "react-native-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/styles";
import generate from "AppSense/lib/generator";

export default class CodeScreen extends Component<{}> {
  state = {
    code: ""
  };

  componentDidMount() {
    const { state, logics, components } = this.props;
    this.setState({
      code: generate({
        state,
        logics,
        components
      })
    });
  }

  _onOpenExpo() {
    fetch(`https://snack.expo.io/--/api/v2/snack/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: {
          "app.js": {
            contents: this.state.code,
            type: "CODE"
          }
        },
        manifest: {
          sdkVersion: "23.0.0"
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("EXPO ID", data.id);
        const url = `https://snack.expo.io/${data.id}`;
        Linking.openURL(url).catch(err =>
          console.error("An error occurred", err)
        );
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.toolbar,
            { backgroundColor: this.props.toolbar.color }
          ]}
        >
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => this.props.onBack()}
          >
            <Image
              style={styles.toolbarIcon}
              source={require("AppSense/assets/back.png")}
            />
          </TouchableOpacity>
          <Text style={styles.toolbarText}>Code Result</Text>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => this._onOpenExpo()}
          >
            <Image
              style={styles.toolbarIcon}
              source={require("AppSense/assets/open.png")}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scroll}>
          <SyntaxHighlighter language="javascript" style={docco}>
            {this.state.code}
          </SyntaxHighlighter>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  toolbar: {
    height: 56,
    backgroundColor: "#075e9b",
    flexDirection: "row",
    alignItems: "center",
    elevation: 3
  },
  toolbarButton: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center"
  },
  toolbarIcon: {
    width: 23,
    height: 23,
    tintColor: "#fff"
  },
  toolbarButton: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center"
  },
  toolbarText: {
    fontWeight: "500",
    color: "#fff",
    flex: 1
  },
  scroll: {
    flex: 1
  }
});
