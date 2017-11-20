export default {
  Text: `{{=<% %>=}}<Text<% #hasStyle %>
            style={{
              <% #color %>color: <%& . %>,<% /color %>
              <% #fontSize %>fontSize: <%& . %>,<% /fontSize %>
            }}<% /hasStyle %>>
            <% value %>
          </Text>`,
  Button: `{{=<% %>=}}<Button<% #title %>
            title=<%& . %><% /title %><% #color %>
            color=<%& . %><% /color %><% #onPress %>
            onPress={() => {<%& . %>}}<% /onPress %> />`,
  Switch: `{{=<% %>=}}<View style={{ flexDirection: "row" }}>
            <Switch<% #value %>
              value=<%& . %><% /value %><% #onValueChange %>
              onValueChange={(value) => {<%& . %>}}<% /onValueChange %> />
            <Text<% #hasStyle %>
              style={{
                <% #color %>color: <%& . %>,<% /color %>
                <% #fontSize %>fontSize: <%& . %>,<% /fontSize %>
              }}<% /hasStyle %>>>
              <% text %>
            </Text>
          </View>`,
  base: `import React, { Component } from 'react';
import { Text, Button, Switch, View, StyleSheet, ScrollView } from 'react-native';


export default class App extends Component {
  {{#hasState}}
  constructor() {
    super();
    this.state = {
{{#state}}      {{{name}}}: {{{value}}},
      {{/state}}
    };
  }

  {{/hasState}}{{#hasDidMount}}
  componentDidMount() {
    {{code}}
  }

  {{/hasDidMount}}
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.toolbar]}>
          <Text style={styles.toolbarText}>My Application</Text>
        </View>
        <ScrollView>
          {{#components}}
            {{{.}}}
          {{/components}}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  toolbar: {
    paddingTop: 26,
    height: 56,
    backgroundColor: "#075e9b",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 15,
    elevation: 3,
  },
  toolbarText: {
    fontWeight: "500",
    color: "#fff",
  },
});
`
};
