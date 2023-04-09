<template>
  <div id="stencil-canvas" ref="sketchContainer" class="w-96 h-96"></div>
  <!-- TODO: Write straigth on screen -->
  <input v-if="stepCount - 1 === currentStep" v-model="labelString" placeholder="Name your soup" />
</template>

<script setup>
/*eslint-disable*/
import { onMounted, ref, reactive, defineProps } from "vue"
import redSVG from "../assets/can/0_red.svg"
import graySVG from "../assets/can/1_gray.svg"
import whiteSVG from "../assets/can/2_white.svg"
import goldSVG from "../assets/can/3_gold.svg"
import blackSVG from "../assets/can/4_black.svg"

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

onMounted(() => {
  // NOTE: Use p5 as an instance mode
  var redStencil, grayStencil, whiteStencil, goldStencil, blackStencil

  const script = function (p5) {
    const P5_CANVAS = {
      width: document.getElementById("stencil-canvas").offsetWidth,
      height: document.getElementById("stencil-canvas").offsetHeight,
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
      touchMoved() {
        if (this.isDragging) {
          const newPosX = p5.mouseX - this.offSetX
          const newPosY = p5.mouseY - this.offSetY
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
        if (p5.mouseX > this.x && p5.mouseX < this.x + this.width && p5.mouseY > this.y && p5.mouseY < this.y + this.height) {
          this.offSetX = p5.mouseX - this.x
          this.offSetY = p5.mouseY - this.y
          this.isDragging = true
        }
      }
      touchEnded() {
        this.isDragging = false
      }
    }

    class Stencil extends DraggableItem {
      constructor({ x, y, width, height, fill, svg }) {
        super({ x, y, width, height, fill })
        this.svg = svg
      }
      display() {
        p5.image(this.svg, this.x, this.y, this.width, this.height)
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

    class Squeege extends DraggableItem {
      constructor({ colorFill }) {
        super({ x: 0, y: 0, width: P5_CANVAS.width, height: 20, fill: 255 })
        this.colorFill = colorFill
      }
      touchMoved() {
        if (this.isDragging) {
          const newPosY = p5.mouseY - this.offSetY

          if (newPosY < 0) {
            this.y = 0
          } else if (newPosY + this.height > P5_CANVAS.height) {
            this.y = P5_CANVAS.height - this.height
          } else {
            this.y = newPosY
          }
        }
      }
      display() {
        p5.fill(this.fill)
        p5.rect(this.x, this.y, this.width, this.height)
        p5.fill(this.colorFill)
        p5.rect(0, 0, this.width, this.y)
      }
    }
  
    p5.preload = () => {
      redStencil = p5.loadSVG(redSVG)
      grayStencil = p5.loadSVG(graySVG)
      whiteStencil = p5.loadSVG(whiteSVG)
      goldStencil = p5.loadSVG(goldSVG)
      blackStencil = p5.loadSVG(blackSVG)

      state.story = [
        {
          story_step: STORY_STEP.STENCIL,
          shape: new Stencil({ x: 0, y: 0, width: 100, height: 200, fill: 100, svg: redStencil }),
        },
        {
          story_step: STORY_STEP.PAINT,
          shape: new Squeege({ colorFill: 120 }),
        },
        {
          story_step: STORY_STEP.STENCIL,
          shape: new Stencil({ x: 0, y: 0, width: 100, height: 200, fill: 100, svg: blackStencil }),
        },
        {
          story_step: STORY_STEP.PAINT,
          shape: new Squeege({ colorFill: 120 }),
        },
        {
          story_step: STORY_STEP.LABEL,
          shape: new Label({ x: 100, y: 100, width: 100, height: 100, fill: 200, text: "Bean Soup" }),
        },
      ]
    }

    p5.touchMoved = () => {
      state.story[props.currentStep].shape.touchMoved()
    }

    p5.touchStarted = () => {
      state.story[props.currentStep].shape.touchStarted()
    }

    p5.touchEnded = () => {
      state.story[props.currentStep].shape.touchEnded()
    }
    // NOTE: Set up is here
    p5.setup = () => {
      const canvas = p5.createCanvas(P5_CANVAS.width, P5_CANVAS.height, p5.SVG)
      canvas.parent("stencil-canvas")
    }

    p5.draw = () => {
      p5.clear()
      p5.background(220)
      p5.fill(255)
      p5.rect(SCREEN_PRINT_CANVAS.posX, SCREEN_PRINT_CANVAS.posY, SCREEN_PRINT_CANVAS.width, SCREEN_PRINT_CANVAS.height)
      state.story.map((item, index) => {
        if (item.story_step === STORY_STEP.STENCIL && index < props.currentStep) {
          item.shape.display()
        }
      })
      state.story[props.currentStep].shape.display()
    }
  }
  new p5(script, sketchContainer.value)
})
</script>
