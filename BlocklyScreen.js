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
  WebView,
  NativeModules
} from "react-native";
const window = Dimensions.get("window");
import uuid from "uuid";

export default class BlocklyScreen extends Component<{}> {
  state = {
    code: null,
    xml: this.props.xml,
    states: this.props.states,
  };
  componentDidMount() {
    console.log("XML", this.props.xml);
  }
  handleNavigationChange = navState => {
    if (navState.title) {
      var title = navState.title.split("<|>");
      if (title.length > 1) {
        var code = title[0];
        var xml = title[1];
        this.setState({
          code,
          xml
        });
      }
    }
  };
  _onSave() {
    console.log("SAVED", this.state.code);
    console.log("XML", this.state.xml);
    this.props.onSave(this.props.logicKey, this.state.code, this.state.xml);
  }
  _generateSetStateJSON() {
    var options = this.state.states.map(s => [s.name, s.name])
    return {
      type: "set_state",
      message0: "setState %1 value %2",
      args0: [
        {
          type: "field_dropdown",
          name: "KEY",
          options: options,
        },
        {
          type: "input_value",
          name: "VALUE"
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: "Set the given state to certain value.",
      helpUrl: "https://reactjs.org/docs/react-component.html#setstate"
    };
  }
  _generateSetStateBlocks() {
    return  `
      Blockly.Blocks["set_state"] = {
        init: function() {
          this.jsonInit(${JSON.stringify(this._generateSetStateJSON())})
        }
      };
      Blockly.JavaScript["set_state"] = function(block) {
        var argKey = block.getFieldValue('KEY');
        var argValue =
          Blockly.JavaScript.valueToCode(
            block,
            "VALUE",
            Blockly.JavaScript.ORDER_ATOMIC
          ) || "''";
        return "this.setState({" + argKey + ": " + argValue + "});\n";
      };
    `;
  }
  _generateGetStateJSON() {
    var options = this.state.states.map(s => [s.name, s.name])
    return {
      type: "get_state",
      message0: "state %1",
      args0: [
        {
          type: "field_dropdown",
          name: "VALUE",
          options: options,
        }
      ],
      inputsInline: true,
      output: null,
      colour: 230,
      tooltip: "Get a state value.",
      helpUrl: "https://reactjs.org/docs/react-component.html"
    };
  }
  _generateGetStateBlocks() {
    return  `
      Blockly.Blocks["get_state"] = {
        init: function() {
          this.jsonInit(${JSON.stringify(this._generateGetStateJSON())})
        }
      };
      Blockly.JavaScript["get_state"] = function(block) {
        return ["this.state." + block.getFieldValue('VALUE'), Blockly.JavaScript.ORDER_NONE];
      };
    `;
  }
  render() {
    let source = {
      uri: `file:///android_asset/blockly/index.html#/?${uuid.v4()}`
    };
    const blocklyStart = `Blockly.Blocks['start'] = {
      init: function() {
        this.setColour(250);
        this.appendDummyInput()
          .setAlign(Blockly.ALIGN_CENTRE)
          .appendField('${this.props.logicKey}');

        this.appendStatementInput('statement');

        this.setDeletable(false);
      }
    };`;
    const blocklySetStates = this._generateSetStateBlocks();
    const blocklyGetStates = this._generateGetStateBlocks();
    const injectedJavaScript = this.state.xml.length
      ? `
    ${blocklyStart}
    ${blocklySetStates}
    ${blocklyGetStates}
    window.onload = function() {
      var xml_text = '${this.state.xml.replace(/\'/g, `\'`)}';
      var xml = Blockly.Xml.textToDom(xml_text);
      demoWorkspace.clear();
      Blockly.Xml.domToWorkspace(xml, demoWorkspace);
    }
`
: `
    ${blocklyStart}
    ${blocklySetStates}
    ${blocklyGetStates}
    window.onload = function() {
      demoWorkspace.clear();
      var startBlock = Blockly.Block.obtain(demoWorkspace, 'start');
      startBlock.initSvg();
      startBlock.render();
    }`;
    // console.log('states:', blocklyStates)
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
          <Text style={styles.toolbarText}>{this.props.logicKey}</Text>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => this._onSave()}
          >
            <Image
              style={styles.toolbarIcon}
              source={require("AppSense/assets/save.png")}
            />
          </TouchableOpacity>
        </View>
        <WebView
          source={source}
          onNavigationStateChange={this.handleNavigationChange}
          style={{ width: window.width, height: window.height }}
          javaScriptEnabledAndroid={true}
          injectedJavaScript={injectedJavaScript}
        />
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
