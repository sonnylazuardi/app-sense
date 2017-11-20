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

export default class RunScreen extends Component<{}> {
  state = {};
  _componentToJSX(component) {
    switch (component.type) {
      case "Text":
        return (
          <Text
            style={{
              fontSize: component.fontSize.value,
              color: component.color.value
            }}
          >
            {component.text.type == "state" ? (
              this.state[component.text.value]
            ) : (
              component.text.value
            )}
          </Text>
        );
        break;
      case "Switch":
        return (
          <View style={{ flexDirection: "row" }}>
            <Switch
              value={
                component.value.type == "state" ? (
                  this.state[component.value.value]
                ) : (
                  component.value.value
                )
              }
              onValueChange={value => {
                this.evalInContext(
                  this.props.logics[component.onValueChange].code,
                  this,
                  value
                );
              }}
            />
            <Text
              style={{
                fontSize: component.fontSize.value,
                color: component.color.value
              }}
            >
              {component.text.type == "state" ? (
                this.state[component.text.value]
              ) : (
                component.text.value
              )}
            </Text>
          </View>
        );
      case "Button":
        return (
          <Button
            title={
              component.title.type == "state" ? (
                this.state[component.title.value]
              ) : (
                component.title.value
              )
            }
            color={
              component.color.type == "state" ? (
                this.state[component.color.value]
              ) : (
                component.color.value
              )
            }
            onPress={() => {
              this.evalInContext(
                this.props.logics[component.onPress].code,
                this
              );
            }}
          />
        );
    }
  }
  evalInContext(js, context, value) {
    return function(value) {
      return eval(js);
    }.call(context, value);
  }
  _formatState() {
    let result = {};
    this.props.state.forEach(item => {
      result[item.name] = item.value;
    });
    return result;
  }
  componentDidMount() {
    const didMount = this.props.logics.componentDidMount;
    if (didMount) {
      this.evalInContext(didMount.code, this);
    }
    this.setState(this._formatState(), () => {
      console.log("DYNAMIC STATE", this.state);
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
          <Text style={styles.toolbarText}>{this.props.toolbar.title}</Text>
        </View>
        <ScrollView style={styles.scroll}>
          {this.props.components.map((component, i) => {
            return <View key={i}>{this._componentToJSX(component)}</View>;
          })}
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
    paddingRight: 15,
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
    color: "#fff"
  },
  scroll: {
    flex: 1
  }
});
