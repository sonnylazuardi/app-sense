import mustache from "mustache";
import base from "./base";

const wrapStateForStyle = bundle =>
  bundle.type !== "value"
    ? `this.state.${bundle.value}`
    : typeof bundle.value === "string"
      ? `'${bundle.value}'`
      : `${bundle.value}`;

const wrapStateForChild = bundle =>
  bundle.type !== "value" ? `{this.state.${bundle.value}}` : bundle.value;

const wrapStateForProp = bundle =>
  bundle.type !== "value"
    ? `{this.state.${bundle.value}}`
    : typeof bundle.value === "string"
      ? `"${bundle.value}"`
      : `{${bundle.value}}`;

export default function generate(dataSet) {
  const data = Object.assign(
    {
      hasState: dataSet.state.length > 0,
      hasDidMount: dataSet.logics.componentDidMount
    },
    dataSet
  );
  data.state = data.state.map(state => {
    if (typeof state.value === "string")
      return Object.assign({}, state, { value: `'${state.value}'` });
    return state;
  });
  data.components = data.components.map(component => {
    switch (component.type) {
      case "Text": {
        const componentSettings = Object.assign(
          {
            hasStyle: component.color || component.fontSize
          },
          component
        );

        if (component.text)
          componentSettings.value = wrapStateForChild(component.text);
        if (component.color)
          componentSettings.color = wrapStateForStyle(component.color);
        if (component.fontSize)
          componentSettings.fontSize = wrapStateForStyle(component.fontSize);

        return mustache.render(base.Text, componentSettings);
      }
      case "Button": {
        const componentSettings = Object.assign({}, component);

        if (component.title)
          componentSettings.title = wrapStateForProp(component.title);
        if (component.color)
          componentSettings.color = wrapStateForProp(component.color);
        if (component.onPress && dataSet.logics[component.onPress])
          componentSettings.onPress = dataSet.logics[component.onPress].code;
        return mustache.render(base.Button, componentSettings);
      }
      case "Switch": {
        const componentSettings = Object.assign(
          {
            hasStyle: component.color || component.fontSize
          },
          component
        );

        if (component.value)
          componentSettings.value = wrapStateForProp(component.value);
        if (component.text)
          componentSettings.text = wrapStateForChild(component.text);
        if (component.color)
          componentSettings.color = wrapStateForStyle(component.color);
        if (component.fontSize)
          componentSettings.fontSize = wrapStateForStyle(component.fontSize);
        if (component.onValueChange && dataSet.logics[component.onValueChange])
          componentSettings.onValueChange =
            dataSet.logics[component.onValueChange].code;

        return mustache.render(base.Switch, componentSettings);
        break;
      }
    }
    if (typeof state.value === "string")
      return Object.assign({}, state, { value: `'${state.value}'` });
    return state;
  });

  return mustache.render(base.base, data);
}
