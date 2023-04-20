<template>
  <div :class="keyboardClass"></div>
</template>

<script>
import Keyboard from "simple-keyboard"
import "simple-keyboard/build/css/index.css"

export default {
  name: "SimpleKeyboard",
  props: {
    keyboardClass: {
      default: "simple-keyboard",
      type: String,
    },
    input: {
      type: String,
    },
  },
  data: () => ({
    keyboard: null,
  }),
  mounted() {
    this.keyboard = new Keyboard(this.keyboardClass, {
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      display: {
        "{shift}": "⇧",
        "{altleft}": "⌥",
        "{backspace}": "⌫",
        "{space}": "⎵",
      },
      layout: {
        default: [
          "< + Ľ Š Č Ť Ź Ý Á Í É = '",
          "Q W E R T Z U I O P Ú Ä {backspace}",
          "A S D F G H J K L Ô § Ň",
          "\\ Y X C V B N M , . -",
          "{shift} {altleft} {space}",
        ],
        shift: [
          "> 1 2 3 4 5 6 7 8 9 0 %",
          "Q W E R T Z U I O P / ( {backspace}",
          'A S D F G H J K L " ! )',
          "| Y X C V B N M ? : _",
          "{shift} {altleft} {space}",
        ],
        alt: [
          "≤ ` @ # $ ~ & * { } ° ^",
          "Q W E € T Z U I O P [ ] {backspace}",
          "A ß ∂ F G H ’ K ł ; ' ¨",
          "\\ Y X C V B N M < > –",
          "{shift} {altleft} {space}",
        ],
      },
    })
  },
  methods: {
    onKeyPress(button) {
      if (button === "{shift}") this.handleShift()
      if (button === "{altleft}") this.handleAlt()
    },
    onChange(input) {
      this.$emit("onChange", input)
    },
    handleAlt() {
      let currentLayout = this.keyboard.options.layoutName
      let altToggle = currentLayout !== "alt" ? "alt" : "default"

      this.keyboard.setOptions({
        layoutName: altToggle,
      })
    },
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName
      let shiftToggle = currentLayout !== "shift" ? "shift" : "default"

      this.keyboard.setOptions({
        layoutName: shiftToggle,
      })
    },
  },
  watch: {
    input(input) {
      this.keyboard.setInput(input)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
