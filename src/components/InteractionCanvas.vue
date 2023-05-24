<template>
  <div id="stencilCanvas" ref="sketchContainer" class="w-full h-full min-h-[350px]"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, reactive, defineProps, defineExpose } from "vue"
import p5 from "p5"

const STORY_STEP = {
  PAINT: "paint",
  STENCIL: "stencil",
  LABEL: "label",
  CONFIRM: "confirm",
}

const CAN = {
  width: 800,
  height: 519,
}

const sketchContainer = ref(null)
const props = defineProps(["currentStep", "stepCount", "labelString"])
const state = reactive({
  story: [],
})

const printCanvas = ref({})
const interactionCanvas = ref({})

let prevStep = 0
let p5Instance

onMounted(() => {
  // NOTE: Use p5 as an instance mode

  const sketch = function (p5) {
    interactionCanvas.value = {
      width: document.getElementById("stencilCanvas").offsetWidth,
      height: document.getElementById("stencilCanvas").offsetHeight,
    }

    printCanvas.value = {
      width: (CAN.height / CAN.width) * (interactionCanvas.value.height - interactionCanvas.value.width / 6),
      height: interactionCanvas.value.height - interactionCanvas.value.width / 6,
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
          const newPosX = p5.mouseX - this.offSetX
          const newPosY = p5.mouseY - this.offSetY
          if (newPosX < 0) {
            this.x = 0
          } else if (newPosX + this.width > interactionCanvas.value.width) {
            this.x = interactionCanvas.value.width - this.width
          } else {
            this.x = newPosX
          }
          if (newPosY < 0) {
            this.y = 0
          } else if (newPosY + this.height > interactionCanvas.value.height) {
            this.y = interactionCanvas.value.height - this.height
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
      constructor({ x, y, width, height, fill, image, stencilImage }) {
        super({ x, y, width, height, fill })
        this.image = image
        this.stencilImage = stencilImage
        this.isPrinted = false
      }
      reset() {
        this.isPrinted = false
      }
      display() {
        if (this.isPrinted) {
          p5.tint(255, 255)
          p5.image(this.image, this.x, this.y, this.width, this.height)
        } else {
          p5.tint(255, 220)
          p5.image(this.stencilImage, this.x, this.y, this.width, this.height)
        }
      }
      setPrinted() {
        if (!this.isPrinted) {
          this.isPrinted = true
        }
      }
    }

    class Label extends DraggableItem {
      constructor({ x, y, width, height, fill, text, stencil }) {
        super({ x, y, width, height, fill })
        this.text = text
        this.stencil = stencil
      }
      display() {
        this.text = props.labelString
        const x = this.stencil.x + this.stencil.width / 2
        const y = this.stencil.y + this.stencil.height * 0.71

        p5.rectMode(p5.CENTER)
        p5.noStroke()
        p5.fill(this.fill)
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.textSize(this.height * 0.4)
        p5.textFont("Mukta");
        p5.text(this.text.toUpperCase(), x, y, this.width, this.height)
        p5.strokeWeight(1)
        p5.rectMode(p5.CORNER)
      }
    }

    class Squeegee {
      constructor({ colorFill, stencil }) {
        this.colorFill = colorFill
        this.stencil = stencil
        this.fill = 255
        this.colorFill = colorFill
        this.height = 70
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
          p5.mouseX > this.stencil.x &&
          p5.mouseX < this.stencil.x + this.stencil.width &&
          p5.mouseY > this.stencil.y &&
          p5.mouseY < this.stencil.y + this.stencil.height + this.height
        ) {
          this.offSetY = p5.mouseY - (this.stencil.y + this.progress)
          this.isDragging = true
        }
      }
      touchEnded() {
        this.isDragging = false
      }
      touchMoved() {
        if (this.isDragging) {
          const newPosY = p5.mouseY - this.offSetY
          if (newPosY < this.stencil.y) {
            this.progress = 0
          } else if (newPosY > this.stencil.y + this.stencil.height) {
            this.progress = this.stencil.height
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
        this.colorFill.setAlpha(220)
        p5.noStroke()
        p5.fill(this.colorFill)
        p5.rect(this.stencil.x, this.stencil.y, this.stencil.width, this.printedHeight)
        //handle
        this.colorFill.setAlpha(255)
        p5.fill(this.colorFill)
        p5.rect(this.stencil.x, this.stencil.y + this.progress, this.stencil.width, this.height)
        p5.fill(0)
        const bladeSize = this.height * 0.75
        p5.rect(this.stencil.x, this.stencil.y + this.progress, this.stencil.width, bladeSize)
        p5.fill(0)
        const handleSize = bladeSize * 1.2
        p5.rect(
          this.stencil.x + this.stencil.width / 2 - handleSize / 2,
          this.stencil.y + this.progress,
          handleSize,
          handleSize,
          handleSize / 7
        )
        const circleSize = handleSize * 0.65
        p5.fill(this.colorFill)

        if (p5.lightness(this.colorFill) < 20) {
          p5.stroke(220)
          p5.strokeWeight(2)
        }

        p5.rect(
          this.stencil.x + this.stencil.width / 2 - circleSize / 2,
          this.stencil.y + this.progress + (handleSize - circleSize) / 2,
          circleSize,
          circleSize,
          circleSize
        )
        p5.fill(0)
        if (p5.lightness(this.colorFill) < 20) {
          p5.fill(220)
        }
        p5.textSize(28)
        p5.textAlign(p5.CENTER, p5.TOP)
        p5.text("↓", this.stencil.x + this.stencil.width / 2, this.stencil.y + this.progress + (handleSize - circleSize) / 1.2)
      }
    }

    p5.preload = () => {
      const redStencil = new Stencil({
        x: 0,
        y: 0,
        width: printCanvas.value.width,
        height: printCanvas.value.height,
        fill: 100,
        image: p5.loadImage(require("@/assets/can/0_red.png")),
        stencilImage: p5.loadImage(require("@/assets/can/0_red_stencil.png")),
      })
      const grayStencil = new Stencil({
        x: 0,
        y: 0,
        width: printCanvas.value.width,
        height: printCanvas.value.height,
        fill: 100,
        image: p5.loadImage(require("@/assets/can/1_gray.png")),
        stencilImage: p5.loadImage(require("@/assets/can/1_gray_stencil.png")),
      })
      const whiteStencil = new Stencil({
        x: 0,
        y: 0,
        width: printCanvas.value.width,
        height: printCanvas.value.height,
        fill: 100,
        image: p5.loadImage(require("@/assets/can/2_white.png")),
        stencilImage: p5.loadImage(require("@/assets/can/2_white_stencil.png")),
      })
      const goldStencil = new Stencil({
        x: 0,
        y: 0,
        width: printCanvas.value.width,
        height: printCanvas.value.height,
        fill: 100,
        image: p5.loadImage(require("@/assets/can/3_gold.png")),
        stencilImage: p5.loadImage(require("@/assets/can/3_gold_stencil.png")),
      })
      const blackStencil = new Stencil({
        x: 0,
        y: 0,
        width: printCanvas.value.width,
        height: printCanvas.value.height,
        fill: 100,
        image: p5.loadImage(require("@/assets/can/4_black.png")),
        stencilImage: p5.loadImage(require("@/assets/can/4_black_stencil.png")),
      })

      state.story = [
        {
          story_step: STORY_STEP.STENCIL,
          shape: redStencil,
        },
        {
          story_step: STORY_STEP.PAINT,
          shape: new Squeegee({ colorFill: p5.color("#B93645"), stencil: redStencil }),
        },
        {
          story_step: STORY_STEP.STENCIL,
          shape: grayStencil,
        },
        {
          story_step: STORY_STEP.PAINT,
          shape: new Squeegee({ colorFill: p5.color("#AAAFAF"), stencil: grayStencil }),
        },
        {
          story_step: STORY_STEP.STENCIL,
          shape: whiteStencil,
        },
        {
          story_step: STORY_STEP.PAINT,
          shape: new Squeegee({ colorFill: p5.color("#F0EBDD"), stencil: whiteStencil }),
        },
        {
          story_step: STORY_STEP.STENCIL,
          shape: goldStencil,
        },
        {
          story_step: STORY_STEP.PAINT,
          shape: new Squeegee({ colorFill: p5.color("#BD974F"), stencil: goldStencil }),
        },
        {
          story_step: STORY_STEP.STENCIL,
          shape: blackStencil,
        },
        {
          story_step: STORY_STEP.PAINT,
          shape: new Squeegee({ colorFill: p5.color("#040404"), stencil: blackStencil }),
        },
        {
          story_step: STORY_STEP.LABEL,
          shape: new Label({
            x: 0,
            y: 0,
            width: printCanvas.value.width * 0.7,
            height: printCanvas.value.height * 0.2,
            fill: p5.color("#B93645"),
            text: "",
            stencil: blackStencil,
          }),
        },
        {
          story_step: STORY_STEP.CONFIRM,
          shape: new DraggableItem({ x: 0, y: 0, width: 0, height: 0, fill: 0 }),
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
      const canvas = p5.createCanvas(interactionCanvas.value.width, interactionCanvas.value.height)
      canvas.parent("stencilCanvas")
    }

    p5.draw = () => {
      p5.clear()
      p5.background(255)
      p5.showPrintMarkers()

      state.story.map((item, index) => {
        if (item.story_step === STORY_STEP.LABEL && index < props.currentStep) {
          item.shape.display()
        } else if (item.story_step === STORY_STEP.STENCIL && index < props.currentStep - 1) {
          item.shape.display()
        } else if (item.story_step === STORY_STEP.PAINT && index == props.currentStep - 1) {
          item.shape.stencil.setPrinted()
        }
      })
      if (state.story[props.currentStep].story_step !== STORY_STEP.CONFIRM) {
        if (prevStep != props.currentStep) {
          state.story[props.currentStep].shape.reset()
          prevStep = props.currentStep
        }
        state.story[props.currentStep].shape.display()
      }
    }

    p5.showPrintMarkers = () => {
      const markersStrokeWeight = 2
      p5.fill(255)
      p5.stroke(0)
      p5.strokeWeight(markersStrokeWeight)
      const offset = 40
      p5.rectMode(p5.CENTER)
      p5.rect(
        p5.width / 2,
        p5.height / 2,
        // print markers are strictly outside the cropping arrea
        printCanvas.value.width + markersStrokeWeight*2,
        printCanvas.value.height + markersStrokeWeight*2
      )
      p5.noStroke()
      p5.rect(p5.width / 2, p5.height / 2, printCanvas.value.width - offset, printCanvas.value.height + offset)
      p5.rect(p5.width / 2, p5.height / 2, printCanvas.value.width + offset, printCanvas.value.height - offset)
      p5.rectMode(p5.CORNER)
    }
  }
  p5Instance = new p5(sketch, sketchContainer.value)
})

// Remove the p5.js instance when the component is unmounted
onBeforeUnmount(() => {
  p5Instance.remove()
})

defineExpose({
  printCanvas,
  interactionCanvas,
})
</script>

<style scoped>
#stencilCanvas {
  touch-action: none;
}
</style>
