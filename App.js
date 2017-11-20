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
import CodeScreen from "./CodeScreen";
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
        code: "this.setState({counter: ((this.state.counter) + 1)});",
        xml:
          '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="start" id=";`rAwHMo8LMphV$j]%OV" deletable="false" x="0" y="0"><statement name="statement"><block type="set_state" id="5x)I!yqJ4!4,?-,kF?Nd"><field name="KEY">counter</field><value name="VALUE"><block type="math_arithmetic" id="fMK?*4B#=c~UZ(e_qS}p"><field name="OP">ADD</field><value name="A"><block type="get_state" id="^8vpzQO3hO%Nei8rDP5!"><field name="VALUE">counter</field></block></value><value name="B"><block type="math_number" id="%leaD0-Lc=rt,;C###`T"><field name="NUM">1</field></block></value></block></value></block></statement></block></xml>',
        description: "Button 0 onPress event."
      }
    },
    toolbar: {
      title: "My Application",
      color: "#075e9b"
    },
    activeComponent: null,
    counter: 1,
    showPropsScreen: false,
    showRunScreen: false,
    showCodeScreen: false,
    showTabScreen: "VIEW"
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
            {component.text.type == "state" ? (
              this.state.state.filter(
                state => state.name == component.text.value
              )[0].value
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
                component.value.type == "state" ? false : component.value.value
              }
            />
            <Text
              style={{
                fontSize: component.fontSize.value,
                color: component.color.value
              }}
            >
              {component.text.type == "state" ? (
                // this.state.state[component.text.value]
                this.state.state.filter(
                  state => state.name == component.text.value
                )[0].value
              ) : (
                component.text.value
              )}
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
            value: "Button " + this.state.counter
          },
          color: {
            type: "value",
            value: "#075e9b"
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
          id: `switch${this.state.counter}`,
          onValueChange: `switch${this.state.counter}_onValueChange`,
          value: {
            type: "value",
            value: false
          },
          text: {
            type: "value",
            value: "Switch " + this.state.counter
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
      ],
      logics: {
        ...this.state.logics,
        ...{
          [`switch${this.state.counter}_onValueChange`]: {
            name: `switch${this.state.counter}_onValueChange`,
            code: "",
            xml: "",
            description: `Switch ${this.state.counter} onValueChange event.`
          }
        }
      },
      counter: this.state.counter + 1
    });
  }
  _addText() {
    this.setState({
      components: [
        ...this.state.components,
        {
          type: "Text",
          id: `text${this.state.counter}`,
          text: {
            type: "value",
            value: "New Text " + this.state.counter
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
      ],
      counter: this.state.counter + 1
    });
  }
  _removeComponent(activeComponent) {
    const currentComponent = this.state.components.filter(
      (component, i) => i == activeComponent
    )[0];
    let logics = { ...this.state.logics };
    if (logics.hasOwnProperty(currentComponent.onPress))
      delete logics[currentComponent.onPress];
    if (logics.hasOwnProperty(currentComponent.onValueChange))
      delete logics[currentComponent.onValueChange];
    this.setState({
      activeComponent: null,
      components: this.state.components.filter(
        (component, i) => i != activeComponent
      ),
      logics: logics
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
  _renderCodeScreen() {
    if (!this.state.showCodeScreen) return null;
    return (
      <View style={styles.overlay}>
        <CodeScreen
          state={this.state.state}
          logics={this.state.logics}
          components={this.state.components}
          toolbar={this.state.toolbar}
          onBack={() => this.setState({ showCodeScreen: false })}
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
          state={this.state.state}
          activeComponent={activeComponent}
          component={component}
          onBack={() => this.setState({ showPropsScreen: false })}
          onSave={(activeComponent, key, value, type) => {
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
                          type: type,
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
      value: value
    });
    this.setState({
      state: storedStates
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
      state: storedStates
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarText}>App Sense</Text>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => this.setState({ showCodeScreen: true })}
          >
            <Image
              style={styles.toolbarIcon}
              source={require("AppSense/assets/code.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.tabbar}>
          <TouchableOpacity
            style={[
              styles.tabbarButton,
              this.state.showTabScreen == "VIEW"
                ? styles.tabbarButtonActive
                : null
            ]}
            onPress={() => this.setState({ showTabScreen: "VIEW" })}
          >
            <Text style={styles.tabbarButtonText}>VIEW</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabbarButton,
              this.state.showTabScreen == "LOGIC"
                ? styles.tabbarButtonActive
                : null
            ]}
            onPress={() => this.setState({ showTabScreen: "LOGIC" })}
          >
            <Text style={styles.tabbarButtonText}>LOGIC</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabbarButton,
              this.state.showTabScreen == "STATE"
                ? styles.tabbarButtonActive
                : null
            ]}
            onPress={() => this.setState({ showTabScreen: "STATE" })}
          >
            <Text style={styles.tabbarButtonText}>STATE</Text>
          </TouchableOpacity>
        </View>
        {this.state.showTabScreen == "STATE" ? (
          <View style={{ flex: 1 }}>
            <StateScreen
              onCreateHandler={this.onStateCreateHandler.bind(this)}
              onDeleteHandler={this.onStateDeleteHandler.bind(this)}
              states={this.state.state}
            />
          </View>
        ) : this.state.showTabScreen == "VIEW" ? (
          <View style={styles.container}>
            <View style={styles.toolbarLeft}>
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
                  color="#075e9b"
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
              states={this.state.state}
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
        )}
        {this._renderPropsScreen()}
        {this._renderCodeScreen()}
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
    height: 56,
    backgroundColor: "#075e9b",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
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
  toolbarLeft: {
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
    backgroundColor: "#075e9b",
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
    backgroundColor: "#075e9b",
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
    backgroundColor: "#075e9b",
    flexDirection: "row",
    elevation: 3
  },
  tabbarButton: {
    backgroundColor: "#075e9b",
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
