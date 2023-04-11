<template>
  <div id="stencilCanvas" ref="sketchContainer" class="w-96 h-96"></div>
  <!-- TODO: Write straigth on screen -->
  <input v-if="stepCount - 1 === currentStep" v-model="labelString" placeholder="Name your soup" />
</template>

<script setup>
/*eslint-disable*/
import { onMounted, onBeforeUnmount, ref, reactive, defineProps } from "vue"
import redSVG from "../assets/can/0_red.svg"
import redStencilSVG from "../assets/can/0_red_stencil.svg"
import blackSVG from "../assets/can/4_black.svg"
import blackStencilSVG from "../assets/can/4_black_stencil.svg"

import p5svg from "p5.js-svg"
import p5 from "p5"

p5svg(p5)

const STORY_STEP = {
  PAINT: "paint",
  STENCIL: "stencil",
  LABEL: "label",
}

const labelString = ref("")
const sketchContainer = ref(null)
const props = defineProps(["currentStep", "stepCount"])
const state = reactive({
  story: [],
})

let prevStep = 0
let pointer
let sketchObject

const p5sketch = (p5) => {
  const P5_CANVAS = {
    width: document.getElementById("stencilCanvas").offsetWidth,
    height: document.getElementById("stencilCanvas").offsetHeight,
  }

  const SCREEN_PRINT_CANVAS = {
    width: 200,
    height: 325,
    posX: (P5_CANVAS.width - 200) / 2,
    posY: (P5_CANVAS.height - 325) / 2,
  }

  class DraggableItem {
    constructor({ x, y, width, height, fill }) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
      this.fill = fill
      this.isDragging = false
    }
    display() {
      p5.fill(this.fill)
      p5.rect(this.x, this.y, this.width, this.height)
    }
    reset() {
      // if necessary, reinit properties
    }
    touchMoved() {
      if (this.isDragging) {
        const newPosX = pointer.x - this.offSetX
        const newPosY = pointer.y - this.offSetY
        if (newPosX < 0) {
          this.x = 0
        } else if (newPosX + this.width > P5_CANVAS.width) {
          this.x = P5_CANVAS.width - this.width
        } else {
          this.x = newPosX
        }
        if (newPosY < 0) {
          this.y = 0
        } else if (newPosY + this.height > P5_CANVAS.height) {
          this.y = P5_CANVAS.height - this.height
        } else {
          this.y = newPosY
        }
      }
    }
    touchStarted() {
      if (pointer.x > this.x && pointer.x < this.x + this.width && pointer.y > this.y && pointer.y < this.y + this.height) {
        this.offSetX = pointer.x - this.x
        this.offSetY = pointer.y - this.y
        this.isDragging = true
      }
    }
    touchEnded() {
      this.isDragging = false
    }
  }

  class Stencil extends DraggableItem {
    constructor({ x, y, width, height, fill, svg, stencilSvg }) {
      super({ x, y, width, height, fill })
      this.svg = svg
      this.stencilSvg = stencilSvg
      this.isPrinted = false
    }
    reset() {
      this.isPrinted = false
    }
    display() {
      if (this.isPrinted) {
        p5.image(this.svg, this.x, this.y, this.width, this.height)
      } else {
        p5.image(this.stencilSvg, this.x, this.y, this.width, this.height)
      }
    }
    setPrinted() {
      if (!this.isPrinted) {
        this.isPrinted = true
      }
    }
  }

  class Label extends DraggableItem {
    constructor({ x, y, width, height, fill, text }) {
      super({ x, y, width, height, fill })
      this.text = text
    }
    display() {
      this.text = labelString.value
      p5.stroke("red")
      p5.strokeWeight(4)
      p5.fill(this.fill)
      p5.rect(this.x, this.y, this.width, this.height)
      p5.noStroke()
      p5.fill(0)
      p5.textAlign(p5.CENTER, p5.CENTER)
      p5.text(this.text, this.x, this.y, this.width, this.height)
    }
  }

  class Squeegee {
    constructor({ colorFill, stencil }) {
      this.colorFill = colorFill
      this.stencil = stencil
      this.fill = 255
      this.height = 10
      this.progress = 0
      this.printedHeight = 0
    }
    reset() {
      this.progress = 0
      this.printedHeight = 0
      this.stencil.reset()
    }
    touchStarted() {
      if (
        pointer.x > this.stencil.x &&
        pointer.x < this.stencil.x + this.stencil.width &&
        pointer.y > this.stencil.y &&
        pointer.y < this.stencil.y + this.stencil.height
      ) {
        this.offSetY = pointer.y - (this.stencil.y + this.progress)
        this.isDragging = true
      }
    }
    touchEnded() {
      this.isDragging = false
    }
    touchMoved() {
      if (this.isDragging) {
        const newPosY = pointer.y - this.offSetY
        if (newPosY < this.stencil.y) {
          this.progress = 0
        } else if (newPosY + this.height > this.stencil.y + this.stencil.height) {
          this.progress = this.stencil.height - this.height
        } else {
          this.progress = newPosY - this.stencil.y
          if (this.progress > this.printedHeight) {
            this.printedHeight = this.progress
          }
        }
      }
    }
    display() {
      this.stencil.display()
      p5.fill(this.colorFill)
      p5.rect(this.stencil.x, this.stencil.y, this.stencil.width, this.printedHeight)
      p5.fill(this.fill)
      p5.rect(this.stencil.x, this.stencil.y + this.progress, this.stencil.width, this.height)
    }
  }

  p5.preload = () => {
    const redStencil = new Stencil({
      x: 0,
      y: 0,
      width: 100,
      height: 200,
      fill: 100,
      svg: p5.loadSVG(redSVG),
      stencilSvg: p5.loadSVG(redStencilSVG),
    })
    const blackStencil = new Stencil({
      x: 0,
      y: 0,
      width: 100,
      height: 200,
      fill: 100,
      svg: p5.loadSVG(blackSVG),
      stencilSvg: p5.loadSVG(blackStencilSVG),
    })

    state.story = [
      {
        story_step: STORY_STEP.STENCIL,
        shape: redStencil,
      },
      {
        story_step: STORY_STEP.PAINT,
        shape: new Squeegee({ colorFill: 120, stencil: redStencil }),
      },
      {
        story_step: STORY_STEP.STENCIL,
        shape: blackStencil,
      },
      {
        story_step: STORY_STEP.PAINT,
        shape: new Squeegee({ colorFill: 120, stencil: blackStencil }),
      },
      {
        story_step: STORY_STEP.LABEL,
        shape: new Label({ x: 100, y: 100, width: 100, height: 100, fill: 200, text: "Bean Soup" }),
      },
    ]
  }

  p5.touchStarted = () => {
    p5.setPointerPosition()
    state.story[props.currentStep].shape.touchStarted()
    return false
  }

  p5.touchMoved = () => {
    p5.setPointerPosition()
    state.story[props.currentStep].shape.touchMoved()
    return false
  }

  p5.touchEnded = () => {
    pointer.set()
    state.story[props.currentStep].shape.touchEnded()
    return false
  }
  // NOTE: Set up is here
  p5.setup = () => {
    const canvas = p5.createCanvas(P5_CANVAS.width, P5_CANVAS.height, p5.SVG)
    canvas.parent("stencilCanvas")
    pointer = p5.createVector()
  }

  p5.draw = () => {
    p5.clear()
    p5.background(220)
    p5.fill(255)
    p5.rect(SCREEN_PRINT_CANVAS.posX, SCREEN_PRINT_CANVAS.posY, SCREEN_PRINT_CANVAS.width, SCREEN_PRINT_CANVAS.height)
    state.story.map((item, index) => {
      if (item.story_step === STORY_STEP.STENCIL && index < props.currentStep - 1) {
        item.shape.display()
      } else if (item.story_step === STORY_STEP.PAINT && index == props.currentStep - 1) {
        item.shape.stencil.setPrinted()
      }
    })
    if (prevStep != props.currentStep) {
      state.story[props.currentStep].shape.reset()
      prevStep = props.currentStep
    }
    state.story[props.currentStep].shape.display()
  }

  p5.setPointerPosition = () => {
    if (typeof p5.touches !== "undefined" && p5.touches.length > 0) {
      pointer.set(p5.touches[0].x, p5.touches[0].y)
    } else {
      pointer.set(p5.mouseX, p5.mouseY)
    }
    console.log("pointer: " + pointer.x)
  }
}

onMounted(() => {
  // NOTE: Use p5 as an instance mode
  sketchObject = new p5(p5sketch, sketchContainer.value)
})

onBeforeUnmount(() => {
  sketchObject.remove()
})
</script>

<style scoped>
#stencilCanvas {
  border: 1px solid red;
  touch-action: none; /* Prevent scrolling or scaling on touch devices */
}
html {
  touch-action: manipulation;
}
</style>
