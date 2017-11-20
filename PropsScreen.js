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
  Picker
} from "react-native";

const Item = Picker.Item;

const COMPONENT_PROPS = {
  Button: ["title", "color"],
  Toolbar: ["title", "color"],
  Text: ["text", "color", "fontSize"],
  Switch: ["text", "color", "fontSize", "value"]
};

export default class PropsScreen extends Component<{}> {
  state = {
    currentKey: null,
    currentValue: null,
    currentType: null
  };

  _selectItem(prop) {
    this.setState({
      currentKey: prop,
      currentValue: this.props.component[prop].value + "",
      currentType: this.props.component[prop].type
    });
  }

  _save() {
    let { currentValue, currentType } = this.state;
    if (this.isNumeric(currentValue)) currentValue = Number(currentValue);
    this.props.onSave(
      this.props.activeComponent,
      this.state.currentKey,
      currentValue,
      currentType
    );
    this.setState({
      currentKey: null,
      currentValue: null,
      currentType: null
    });
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  _cancel() {
    this.setState({
      currentKey: null,
      currentValue: null,
      currentType: null
    });
  }

  render() {
    const currentProps = COMPONENT_PROPS[this.props.component.type];
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => this.props.onBack()}
          >
            <Image
              style={styles.toolbarIcon}
              source={require("AppSense/assets/back.png")}
            />
          </TouchableOpacity>
          <Text style={styles.toolbarText}>{this.props.component.type}</Text>
        </View>
        <ScrollView style={styles.scroll}>
          {currentProps.map((prop, i) => {
            return (
              <TouchableOpacity
                style={styles.propItem}
                key={i}
                onPress={() => this._selectItem(prop)}
              >
                <View style={styles.propItemWrapper}>
                  <Text style={styles.propItemKey}>{prop}</Text>
                  <Text style={styles.propItemValue}>
                    {this.props.component[prop].value}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {this.state.currentKey ? (
          <View style={styles.panelWrapper}>
            <TouchableOpacity
              style={styles.panelBlur}
              onPress={() => this._cancel()}
            />
            <View style={styles.panel}>
              <Text style={styles.panelTitleText}>{this.state.currentKey}</Text>
              {this.state.currentType == "state" ? (
                <Picker
                  style={styles.input}
                  mode="dropdown"
                  // itemStyle={styles.pickerItemStyle}
                  selectedValue={this.state.currentValue}
                  onValueChange={currentValue => {
                    this.setState({
                      currentValue
                    });
                  }}
                >
                  {this.props.state.map((state, i) => {
                    return (
                      <Item key={i} label={state.name} value={state.name} />
                    );
                  })}
                </Picker>
              ) : (
                <TextInput
                  style={styles.input}
                  value={this.state.currentValue}
                  onChangeText={currentValue => this.setState({ currentValue })}
                />
              )}
              <View style={styles.option}>
                <Switch
                  value={this.state.currentType == "state"}
                  onValueChange={value =>
                    this.setState({ currentType: value ? "state" : "value" })}
                />
                <Text style={styles.panelText}>take from state</Text>
              </View>
              <View style={styles.actions}>
                <Button
                  title="CANCEL"
                  color="#999"
                  onPress={() => this._cancel()}
                />
                <View style={{ width: 10 }} />
                <Button
                  title="SAVE"
                  color="#2ecc71"
                  onPress={() => this._save()}
                />
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  toolbar: {
    height: 56,
    backgroundColor: "#2ecc71",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 15,
    elevation: 3
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    padding: 15,
    bottom: 0,
    right: 0,
    left: 0
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
  toolbarText: {
    fontWeight: "500",
    color: "#fff"
  },
  scroll: {
    flex: 1
  },
  propItem: {
    height: 60,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 15
  },
  propItemKey: {
    color: "#000"
  },
  propItemValue: {
    color: "#999"
  },
  panelWrapper: {
    zIndex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  },
  panelBlur: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  panel: {
    padding: 15,
    backgroundColor: "#fff",
    elevation: 4,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 180
  },
  panelTitleText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 16
  },
  panelText: {
    color: "#999"
  },
  input: {
    height: 60
  }
});
