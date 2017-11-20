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
    xml: this.props.xml
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
    const injectedJavaScript = this.state.xml.length
      ? `
    ${blocklyStart}
    window.onload = function() {
      var xml_text = '${this.state.xml.replace(/\'/g, `\'`)}';
      var xml = Blockly.Xml.textToDom(xml_text);
      demoWorkspace.clear();
      Blockly.Xml.domToWorkspace(xml, demoWorkspace);
    }
`
      : `
    ${blocklyStart}
    window.onload = function() {
      demoWorkspace.clear();
      var startBlock = Blockly.Block.obtain(demoWorkspace, 'start');
      startBlock.initSvg();
      startBlock.render();
    }`;
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
    backgroundColor: "#2ecc71",
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
