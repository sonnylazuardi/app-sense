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
      onValueChange: "switch0_onValueChange",
      id: "switch0",
      value: {
        type: "state",
        value: "isAmpas"
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
        value: "#075e9b"
      },
      fontSize: {
        type: "value",
        value: 16
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
    },
    {
      type: "Button",
      onPress: "button0_onPress",
      id: "button0",
      title: {
        type: "value",
        value: "SUBMIT"
      },
      color: {
        type: "value",
        value: "#075e9b"
      }
    }
  ]
};

export default data;
