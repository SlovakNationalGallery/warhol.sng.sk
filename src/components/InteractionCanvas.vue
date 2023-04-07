<template>
  <div id="stencil-canvas" class="w-96 h-96"></div>
  <!-- TODO: Write straigth on screen -->
  <input v-if="stepCount - 1 === step" v-model="labelString" placeholder="Name your soup" />
</template>

<script setup>
import { onMounted, ref, reactive, defineProps } from "vue"

const STORY_STEP = {
  PAINT: "paint",
  STENCIL: "stencil",
  LABEL: "label",
}

const labelString = ref("")
const props = defineProps(["step", "stepCount"])
const state = reactive({
  story: []
})

onMounted(() => {
  // NOTE: Use p5 as an instance mode
  const P5 = require("p5")
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
      mouseDragged() {
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
      mouseDragged() {
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

    state.story = [
      {
        story_step: STORY_STEP.STENCIL,
        shape: new DraggableItem({ x: 0, y: 0, width: 100, height: 200, fill: 100 }),
      },
      {
        story_step: STORY_STEP.PAINT,
        shape: new Squeege({ colorFill: 120 }),
      },
      {
        story_step: STORY_STEP.STENCIL,
        shape: new DraggableItem({ x: 0, y: 0, width: 100, height: 200, fill: 100 }),
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

    p5.mouseDragged = () => {
      state.story[props.step].shape.mouseDragged()
    }

    p5.touchStarted = () => {
      state.story[props.step].shape.touchStarted()
    }

    p5.touchEnded = () => {
      state.story[props.step].shape.touchEnded()
    }

    // NOTE: Set up is here
    p5.setup = () => {
      const canvas = p5.createCanvas(P5_CANVAS.width, P5_CANVAS.height)
      canvas.parent("stencil-canvas")
    }

    p5.draw = () => {
      p5.background(220)
      p5.fill(255)
      p5.rect(SCREEN_PRINT_CANVAS.posX, SCREEN_PRINT_CANVAS.posY, SCREEN_PRINT_CANVAS.width, SCREEN_PRINT_CANVAS.height)
      state.story.map((item, index) => {
        if (item.story_step === STORY_STEP.STENCIL && index < props.step) {
          item.shape.display()
        }
      })
      state.story[props.step].shape.display()
    }
  }
  new P5(script)
})
</script>
