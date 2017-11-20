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
  ListView
} from "react-native";

export default class StateScreen extends Component<{}> {
  constructor(props) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    super(props);
    this.state = {
      ds: ds,
      isChosen: false,
      name: "",
      value: "",
      dataSource: ds.cloneWithRows(this.props.states)
    };
  }

  onItemPress(name, value) {
    if (this.state.isChosen) {
      if (name == this.state.name) {
        this.setState({
          isChosen: false,
          name: "",
          value: ""
        });
      } else {
        if (value === true) value = "true";
        if (value === false) value = "false";
        this.setState({
          name: name,
          value: value
        });
      }
    } else {
      if (value === true) value = "true";
      if (value === false) value = "false";
      this.setState({
        isChosen: true,
        name: name,
        value: value
      });
    }
  }

  handleCreate(name, value) {
    if (value === "true") value = true;
    if (value === "false") value = false;
    this.props.onCreateHandler(name, value);
    this.setState({
      isUpdate: false,
      name: "",
      value: "",
      dataSource: this.state.ds.cloneWithRows(this.props.states)
    });
  }

  handleDelete(name) {
    this.props.onDeleteHandler(name);
    this.setState({
      isChosen: false,
      name: "",
      value: "",
      dataSource: this.state.ds.cloneWithRows(this.props.states)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <TextInput
            style={{ height: 40 }}
            onChangeText={name => this.setState({ name })}
            placeholder={"State Name"}
            value={this.state.name}
            editable={!this.state.isChosen}
          />
          <TextInput
            style={{ height: 40 }}
            onChangeText={value => this.setState({ value })}
            placeholder={"State Value"}
            value={this.state.value}
            editable={!this.state.isChosen}
          />
          {this.state.isChosen ? (
            <Button
              onPress={() => {
                const { name } = this.state;
                this.handleDelete(name);
              }}
              title="Delete State"
              color="red"
              accessibilityLabel="Learn more about this purple button"
            />
          ) : (
            <Button
              onPress={() => {
                const { name, value } = this.state;
                this.handleCreate(name, value);
              }}
              title={"Create State"}
              color="#075e9b"
              accessibilityLabel="Learn more about this purple button"
            />
          )}
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={rowData => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => this.onItemPress(rowData.name, rowData.value)}
            >
              <Text style={{ color: "#000", fontWeight: "500" }}>
                {rowData.name}
              </Text>
              <Text style={{ color: "#999" }}>{rowData.name}</Text>
            </TouchableOpacity>
          )}
        />
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
  box: {
    padding: 15
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
    height: 60,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 15
  },
  itemIcon: {
    width: 30,
    height: 30,
    backgroundColor: "#999",
    borderRadius: 20,
    marginHorizontal: 10
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
