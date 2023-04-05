<template>
  <div id="label-canvas" class="w-96 h-96"></div>
  <input v-model="labelString" placeholder="Name your soup" />
</template>

<script setup>
import { onMounted, ref } from "vue";
const labelString = ref("");

onMounted(() => {
  // NOTE: Use p5 as an instance mode
  const P5 = require("p5");
  const script = function (p5) {
    const P5_CANVAS = {
      width: document.getElementById("label-canvas").offsetWidth,
      height: document.getElementById("label-canvas").offsetHeight,
    };

    const LABEL = {
      posX: P5_CANVAS.width / 2 - 175,
      posY: (P5_CANVAS.height - 250) / 2,
      color: 240,
      width: 100,
      height: 75,
      isDragging: false,
      isOver: false,
      offSetX: null,
      offSetY: null,
    };

    const SCREEN_PRINT_CANVAS = {
      width: 200,
      height: 325,
      posX: (P5_CANVAS.width - 200) / 2,
      posY: (P5_CANVAS.height - 325) / 2,
    };

    p5.mouseDragged = () => {
      if (LABEL.isDragging) {
        LABEL.posX = p5.mouseX - LABEL.offSetX;
        LABEL.posY = p5.mouseY - LABEL.offSetY;
      }
    };

    p5.mouseMoved = () => {
      if (
        p5.mouseX > LABEL.posX &&
        p5.mouseX < LABEL.posX + LABEL.width &&
        p5.mouseY > LABEL.posY &&
        p5.mouseY < LABEL.posY + LABEL.height
      ) {
        LABEL.isOver = true;
      } else {
        LABEL.isOver = false;
      }

      if (LABEL.isOver) {
        LABEL.color = 200;
      } else {
        LABEL.color = 240;
      }
    };

    p5.mousePressed = () => {
      if (LABEL.isOver) {
        LABEL.offSetX = p5.mouseX - LABEL.posX;
        LABEL.offSetY = p5.mouseY - LABEL.posY;
        LABEL.isDragging = true;
      }
    };

    p5.mouseReleased = () => {
      LABEL.isDragging = false;
    };

    // NOTE: Set up is here
    p5.setup = () => {
      const canvas = p5.createCanvas(P5_CANVAS.width, P5_CANVAS.height);
      canvas.parent("label-canvas");
    };

    p5.draw = () => {
      p5.background(220);
      p5.fill(255);
      p5.rect(
        SCREEN_PRINT_CANVAS.posX,
        SCREEN_PRINT_CANVAS.posY,
        SCREEN_PRINT_CANVAS.width,
        SCREEN_PRINT_CANVAS.height
      );
      p5.stroke("red");
      p5.strokeWeight(4);
      p5.fill(LABEL.color);
      p5.rect(LABEL.posX, LABEL.posY, LABEL.width, LABEL.height);
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(
        labelString.value,
        LABEL.posX,
        LABEL.posY,
        LABEL.width,
        LABEL.height
      );
    };
  };
  new P5(script);
});
</script>
