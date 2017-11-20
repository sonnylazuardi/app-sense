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
  Dimensions
} from "react-native";
import JsxParser from "./lib/jsxParser/components/JsxParser";
import SortableList from "react-native-sortable-list";
import Row from "./src/components/row";
import PropsScreen from "./PropsScreen";
import RunScreen from "./RunScreen";
import LogicScreen from "./LogicScreen";
import StateScreen from "./StateScreen";
import BlocklyScreen from "./BlocklyScreen";
import data from "./data";

const window = Dimensions.get("window");

export default class App extends Component<{}> {
  state = {
    state: data.state,
    components: data.components,
    logics: {
      componentDidMount: {
        name: "componentDidMount",
        code: "",
        xml: "",
        description: "invoked immediately after a component is mounted."
      },
      button0_onPress: {
        name: "button0_onPress",
        code: "",
        xml: "",
        description: "Button 0 onPress event."
      },
      switch0_onValueChange: {
        name: "switch0_onValueChange",
        code: "alert(value); this.setState({isAmpas: value});",
        xml: "",
        description: "Switch 0 onPress event."
      }
    },
    toolbar: {
      title: "My Application",
      color: "#2ecc71"
    },
    activeComponent: null,
    counter: 1,
    showPropsScreen: false,
    showRunScreen: false,
    showScreenTab: 'VIEW',
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
            <Switch
              value={
                component.value.type == "state" ? false : component.value.value
              }
            />
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
            onPress={() => {}}
          />
        );
    }
  }
  _formatComponents(components) {
    let result = {};
    components.forEach((component, i) => {
      result[i] = {
        ...component,
        isActive: i == this.state.activeComponent,
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
          id: `button${this.state.counter}`,
          onPress: `button${this.state.counter}_onPress`,
          title: {
            type: "value",
            value: "SUBMIT"
          },
          color: {
            type: "value",
            value: "#2ecc71"
          }
        }
      ],
      logics: {
        ...this.state.logics,
        ...{
          [`button${this.state.counter}_onPress`]: {
            name: `button${this.state.counter}_onPress`,
            code: "",
            xml: "",
            description: `Button ${this.state.counter} onPress event.`
          }
        }
      },
      counter: this.state.counter + 1
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
  _removeComponent(activeComponent) {
    this.setState({
      activeComponent: null,
      components: this.state.components.filter(
        (component, i) => i != activeComponent
      )
    });
  }
  _renderRunScreen() {
    if (!this.state.showRunScreen) return null;
    return (
      <View style={styles.overlay}>
        <RunScreen
          state={this.state.state}
          logics={this.state.logics}
          components={this.state.components}
          onBack={() => this.setState({ showRunScreen: false })}
          toolbar={this.state.toolbar}
        />
      </View>
    );
  }
  _renderPropsScreen() {
    if (!this.state.showPropsScreen) return null;
    const activeComponent = this.state.activeComponent;
    let component = this.state.components[activeComponent];
    if (activeComponent == -1) {
      component = {
        type: "Toolbar",
        title: {
          type: "value",
          value: this.state.toolbar.title
        },
        color: {
          type: "value",
          value: this.state.toolbar.color
        }
      };
    }
    return (
      <View style={styles.overlay}>
        <PropsScreen
          activeComponent={activeComponent}
          component={component}
          onBack={() => this.setState({ showPropsScreen: false })}
          onSave={(activeComponent, key, value) => {
            if (activeComponent == -1) {
              this.setState({
                toolbar: {
                  ...this.state.toolbar,
                  ...{ [key]: value }
                }
              });
            } else {
              this.setState({
                components: this.state.components.map((component, i) => {
                  if (i == activeComponent) {
                    return {
                      ...component,
                      ...{
                        [key]: {
                          type: "value",
                          value: value
                        }
                      }
                    };
                  }
                  return component;
                })
              });
            }
          }}
        />
      </View>
    );
  }

  onStateCreateHandler(name, value) {
    const storedStates = this.state.state;
    storedStates.push({
      name: name,
      value: value,
    });
    this.setState({
      state: storedStates,
    });
  }

  onStateDeleteHandler(name) {
    const storedStates = this.state.state;
    for (var i = 0; i < storedStates.length; i++) {
      if (storedStates[i].name === name) {
          storedStates.splice(i, 1);
          break;
      }
    }

    this.setState({
      state: storedStates,
    });
  }

  render() {
    // const buttonPressed = () => {
    //   this.evalInContext(this.state.functionAmpas, this);
    // };
    return (
      <View style={{ flex: 1 }}>
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
        <View style={styles.tabbar}>
          <TouchableOpacity
            style={[
              styles.tabbarButton,
              this.state.showTabScreen == 'VIEW' ? styles.tabbarButtonActive : null
            ]}
            onPress={() => this.setState({ showTabScreen: 'VIEW' })}
          >
            <Text style={styles.tabbarButtonText}>VIEW</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabbarButton,
              this.state.showTabScreen == 'LOGIC' ? styles.tabbarButtonActive : null
            ]}
            onPress={() => this.setState({ showTabScreen: 'LOGIC' })}
          >
            <Text style={styles.tabbarButtonText}>LOGIC</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabbarButton,
              this.state.showTabScreen == 'STATE' ? styles.tabbarButtonActive : null
            ]}
            onPress={() => this.setState({ showTabScreen: 'STATE' })}
          >
            <Text style={styles.tabbarButtonText}>STATE</Text>
          </TouchableOpacity>
        </View>
        { (this.state.showTabScreen == 'STATE' ? (
          <View style={{ flex: 1 }}>
            <StateScreen
              onCreateHandler={this.onStateCreateHandler.bind(this)}
              onDeleteHandler={this.onStateDeleteHandler.bind(this)}
              states={this.state.state}
            />
          </View>
        ) : (this.state.showTabScreen == 'VIEW' ? (
          <View style={styles.container}>
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
            <View
              style={styles.canvas}
              // onLongPress={() => {
              //   console.log("BG LONG PRESS");
              // }}
            >
              <TouchableOpacity
                style={[
                  styles.header,
                  { backgroundColor: this.state.toolbar.color }
                ]}
                onPress={() => this.setState({ activeComponent: -1 })}
              >
                <Text style={styles.headerText}>
                  {this.state.toolbar.title}
                </Text>
              </TouchableOpacity>
              <SortableList
                style={styles.list}
                scrollEnabled={true}
                rowActivationTime={200}
                onChangeOrder={nextOrder => {
                  this._nextOrder = nextOrder;
                }}
                manuallyActivateRows={true}
                onReleaseRow={key => {
                  // this.setState({
                  //   activeComponent: null
                  // });
                  // console.log("NEXT ORDER", this._nextOrder);
                  if (this._nextOrder.length > 0) {
                    this.setState({
                      activeComponent: null,
                      components: this._reorderComponents(
                        this.state.components,
                        this._nextOrder
                      )
                    });
                  }
                }}
                onPressRow={key => {
                  // if (this._nextOrder.length > 0) {
                  this.setState({
                    activeComponent: key
                    // components: this._reorderComponents(
                    //   this.state.components,
                    //   this._nextOrder
                    // )
                  });
                  // }
                }}
                onActivateRow={key => {
                  console.log("ACTIVE ROW", key);
                }}
                contentContainerStyle={styles.contentContainer}
                data={this._formatComponents(this.state.components)}
                renderRow={this._renderRow}
              />
            </View>
            {this.state.activeComponent ? (
              <View style={styles.panelProps}>
                <Text style={styles.panelPropsText}>
                  {this.state.activeComponent != -1 ? (
                    this.state.components[this.state.activeComponent].type
                  ) : (
                    "Toolbar"
                  )}
                </Text>
                {this.state.activeComponent != -1 ? (
                  <Button
                    title="REMOVE"
                    color="#999"
                    onPress={() =>
                      this._removeComponent(this.state.activeComponent)}
                  />
                ) : null}
                <View style={{ width: 10 }} />
                <Button
                  title="PROPS"
                  color="#2ecc71"
                  onPress={() => this.setState({ showPropsScreen: true })}
                />
                <View style={{ width: 10 }} />
                <Button
                  title="X"
                  color="#999"
                  onPress={() => this.setState({ activeComponent: null })}
                />
              </View>
            ) : null}
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <LogicScreen
              logics={this.state.logics}
              onSaveLogic={(logicKey, code, xml) => {
                this.setState({
                  logics: {
                    ...this.state.logics,
                    ...{
                      [logicKey]: {
                        ...this.state.logics[logicKey],
                        name: logicKey,
                        code: code,
                        xml: xml
                      }
                    }
                  }
                });
              }}
            />
          </View>
        )))}
        {this._renderPropsScreen()}
        {this._renderRunScreen()}

        <TouchableOpacity
          style={styles.buttonFab}
          onPress={() =>
            this.setState({ showRunScreen: !this.state.showRunScreen })}
        >
          {this.state.showRunScreen ? (
            <Image
              source={require("AppSense/assets/stop.png")}
              style={styles.buttonFabIcon}
            />
          ) : (
            <Image
              source={require("AppSense/assets/play.png")}
              style={styles.buttonFabIcon}
            />
          )}
        </TouchableOpacity>
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
    width: 100
  },
  list: {
    flex: 1
  },
  contentContainer: {
    width: window.width - 100,
    paddingBottom: 80
  },
  canvas: {
    flex: 1,
    backgroundColor: "#eee"
  },
  toolButton: {
    height: 60,
    alignItems: "center",
    justifyContent: "center"
  },
  panelProps: {
    zIndex: 1,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4
  },
  panelPropsText: {
    flex: 1
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
  },
  header: {
    height: 50,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    paddingHorizontal: 15,
    elevation: 3
  },
  headerText: {
    color: "#fff",
    fontWeight: "500"
  },
  buttonFab: {
    elevation: 5,
    backgroundColor: "#2ecc71",
    borderRadius: 25,
    height: 50,
    width: 50,
    position: "absolute",
    bottom: 54,
    right: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonFabIcon: {
    width: 23,
    height: 23,
    tintColor: "#fff"
  },
  tabbar: {
    backgroundColor: "#2ecc71",
    flexDirection: "row",
    elevation: 3
  },
  tabbarButton: {
    backgroundColor: "#2ecc71",
    flex: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  tabbarButtonActive: {
    borderBottomWidth: 3,
    borderColor: "#fff"
  },
  tabbarButtonText: {
    color: "#fff",
    fontWeight: "500"
  }
});
