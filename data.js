const data = {
  state: [
    {
      name: "counter",
      value: 0
    }
  ],
  components: [
    {
      type: "Text",
      text: {
        type: "value",
        value: "Click the button below to add counter value."
      },
      color: {
        type: "value",
        value: "#000"
      },
      fontSize: {
        type: "value",
        value: 16
      }
    },
    {
      type: "Text",
      text: {
        type: "state",
        value: "counter"
      },
      color: {
        type: "value",
        value: "#075e9b"
      },
      fontSize: {
        type: "value",
        value: 30
      }
    },
    {
      type: "Button",
      onPress: "button0_onPress",
      id: "button0",
      title: {
        type: "value",
        value: "Add counter"
      },
      color: {
        type: "value",
        value: "#075e9b"
      }
    }
  ]
};

export default data;
