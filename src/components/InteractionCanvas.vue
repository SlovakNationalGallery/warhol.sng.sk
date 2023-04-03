<template>
  <div id="interaction-canvas" class="w-[50rem] h-[50rem]"></div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  // NOTE: Use p5 as an instance mode
  const P5 = require("p5");
  const script = function (p5) {
    const P5_CANVAS = {
      width: document.getElementById('interaction-canvas').offsetWidth,
      height: document.getElementById('interaction-canvas').offsetHeight
    }

    const SCREEN_PRINT_CANVAS = {
      width: 200,
      height: 325,
      posX: (P5_CANVAS.width - 200) / 2,
      posY: (P5_CANVAS.height - 325) / 2,
    };

    const STENCIL = {
      posX: P5_CANVAS.width / 2 - 175,
      posY: (P5_CANVAS.height - 250) / 2,
      color: 120,
      width: 175,
      height: 250,
      isDragging: false,
      isOver: false,
      offSetX: null,
      offSetY: null,
    };

    p5.mouseDragged = () => {
      if (STENCIL.isDragging) {
        if (
          p5.mouseX > STENCIL.width / 2 &&
          p5.mouseX < P5_CANVAS.width - (STENCIL.width - STENCIL.offSetX) / 2
        ) {
          STENCIL.posX = p5.mouseX - STENCIL.offSetX;
        }
        if (
          p5.mouseY > STENCIL.height / 2 &&
          p5.mouseY < P5_CANVAS.height - (STENCIL.height - STENCIL.offSetY) / 2
        ) {
          STENCIL.posY = p5.mouseY - STENCIL.offSetY;
        }
      }
    };

    p5.mouseMoved = () => {
      if (
        p5.mouseX > STENCIL.posX &&
        p5.mouseX < STENCIL.posX + STENCIL.width &&
        p5.mouseY > STENCIL.posY &&
        p5.mouseY < STENCIL.posY + STENCIL.height
      ) {
        STENCIL.isOver = true;
      } else {
        STENCIL.isOver = false;
      }

      if (STENCIL.isOver) {
        STENCIL.color = 80;
      } else {
        STENCIL.color = 160;
      }
    };

    p5.mousePressed = () => {
      if (STENCIL.isOver) {
        STENCIL.offSetX = p5.mouseX - STENCIL.posX;
        STENCIL.offSetY = p5.mouseY - STENCIL.posY;
        STENCIL.isDragging = true;
      }
    };

    p5.mouseReleased = () => {
      STENCIL.isDragging = false;
    };

    // NOTE: Set up is here
    p5.setup = () => {
      const canvas = p5.createCanvas(P5_CANVAS.width, P5_CANVAS.height);
      canvas.parent("interaction-canvas");
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
      p5.fill(STENCIL.color);
      p5.rect(STENCIL.posX, STENCIL.posY, STENCIL.width, STENCIL.height);
    };
  };
  new P5(script);
});
</script>
