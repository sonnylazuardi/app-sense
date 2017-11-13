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
  Easing
} from "react-native";
import JsxParser from "./lib/jsxParser/components/JsxParser";
import SortableList from "react-native-sortable-list";
import Row from "./src/components/row";

const data = {
  state: [
    {
      name: "isAmpas",
      value: false
    },
    {
      name: "ampasText",
      value: "Teks ini tidak ampas"
    }
  ],
  components: [
    {
      type: "Switch",
      value: {
        type: "value",
        value: false
      },
      text: {
        type: "value",
        value: "Ubah jadi ampas"
      },
      color: {
        type: "value",
        value: "#333"
      },
      fontSize: {
        type: "value",
        value: 15
      }
    },
    {
      type: "Text",
      text: {
        type: "value",
        value: "Teks lagi nih"
      },
      color: {
        type: "value",
        value: "#2ecc71"
      },
      fontSize: {
        type: "value",
        value: 16
      }
    },
    {
      type: "Button",
      title: {
        type: "value",
        value: "SUBMIT"
      },
      color: {
        type: "value",
        value: "#2ecc71"
      }
    },
    {
      type: "Text",
      text: {
        type: "value",
        value: "Teks ini tidak ampas"
      },
      color: {
        type: "value",
        value: "#333"
      },
      fontSize: {
        type: "value",
        value: 15
      }
    }
  ]
};

export default class App extends Component<{}> {
  state = {
    state: data.state,
    components: data.components,
    counter: 1,
    htmlAmpas: `<View><Text>Apakah ampas?</Text><Text>Tes lagi dong?</Text><Switch value={true}/><Button onPress={'buttonPressed'} title="TESTING" /></View>`,
    functionAmpas: `alert('1');this.setState({counter: 3,});alert('2');`
  };
  _nextOrder = [];
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
            {component.text.value}
          </Text>
        );
        break;
      case "Switch":
        return (
          <View style={{ flexDirection: "row" }}>
            <Switch value={component.value.value} />
            <Text
              style={{
                fontSize: component.fontSize.value,
                color: component.color.value
              }}
            >
              {component.text.value}
            </Text>
          </View>
        );
      case "Button":
        return (
          <Button
            title={component.title.value}
            color={component.color.value}
            onPress={() => alert("test")}
          />
        );
    }
  }
  _formatComponents(components) {
    let result = {};
    components.forEach((component, i) => {
      result[i] = {
        ...component,
        component: this._componentToJSX(component)
      };
    });
    return result;
  }
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
  _renderRow = ({ data, active }) => {
    return <Row data={data} active={active} />;
  };
  _reorderComponents(components, nextOrder) {
    return nextOrder.map(orderId => {
      const current = components[orderId];
      return current;
    });
  }
  _addButton() {
    this.setState({
      components: [
        ...this.state.components,
        {
          type: "Button",
          title: {
            type: "value",
            value: "SUBMIT"
          },
          color: {
            type: "value",
            value: "#2ecc71"
          }
        }
      ]
    });
  }
  _addSwitch() {
    this.setState({
      components: [
        ...this.state.components,
        {
          type: "Switch",
          value: {
            type: "value",
            value: false
          },
          text: {
            type: "value",
            value: "Switch"
          },
          color: {
            type: "value",
            value: "#333"
          },
          fontSize: {
            type: "value",
            value: 15
          }
        }
      ]
    });
  }
  _addText() {
    this.setState({
      components: [
        ...this.state.components,
        {
          type: "Text",
          text: {
            type: "value",
            value: "Teks baru"
          },
          color: {
            type: "value",
            value: "#333"
          },
          fontSize: {
            type: "value",
            value: 15
          }
        }
      ]
    });
  }
  render() {
    const { counter } = this.state;
    const buttonPressed = () => {
      this.evalInContext(this.state.functionAmpas, this);
    };
    return (
      <View style={styles.container}>
        {/* <Text>{counter}</Text>
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
        /> */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => this._addText()}
          >
            <Text style={styles.toolButtonText}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => this._addButton()}
          >
            <Text style={styles.toolButtonText}>Button</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => this._addSwitch()}
          >
            <Text style={styles.toolButtonText}>Switch</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.canvas}>
          <SortableList
            style={styles.list}
            onChangeOrder={nextOrder => {
              this._nextOrder = nextOrder;
            }}
            onReleaseRow={key => {
              setTimeout(() => {
                this.setState({
                  components: this._reorderComponents(
                    this.state.components,
                    this._nextOrder
                  )
                });
              });
            }}
            onPressRow={key => {}}
            onActivateRow={key => {}}
            contentContainerStyle={styles.contentContainer}
            data={this._formatComponents(this.state.components)}
            renderRow={this._renderRow}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    flexDirection: "row"
  },
  toolbar: {
    flex: 1
  },
  list: {
    flex: 1
  },
  contentContainer: {
    flex: 1
  },
  canvas: {
    flex: 2,
    backgroundColor: "#eee"
  },
  toolButton: {
    height: 60,
    alignItems: "center",
    justifyContent: "center"
  }
});
