export default {
  Text : `{{=<% %>=}}<Text<% #hasStyle %>
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
import { Text, Button, Switch, View, StyleSheet } from 'react-native';


export default class App extends Component {
  {{#hasState}}
  constructor() {
    super();
    this.state = {
{{#state}}      {{{name}}}: {{{value}}},
      {{/state}}
    };
  }

  {{/hasState}}
  render() {
    return (
      <View style={styles.container}>
        {{#components}}
          {{{.}}}
        {{/components}}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
});
`}