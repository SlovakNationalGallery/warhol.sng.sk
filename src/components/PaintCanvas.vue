<template>
  <div id="paint-canvas" class="w-96 h-96"></div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  // NOTE: Use p5 as an instance mode
  const P5 = require("p5");
  const script = function (p5) {
    const P5_CANVAS = {
      width: document.getElementById("paint-canvas").offsetWidth,
      height: document.getElementById("paint-canvas").offsetHeight,
    };

    const SCREEN_PRINT_CANVAS = {
      width: 200,
      height: 325,
      posX: (P5_CANVAS.width - 200) / 2,
      posY: (P5_CANVAS.height - 325) / 2,
    };

    const SQUEEGEE = {
      posX: 0,
      posY: 0,
      height: 15,
      progress: 0,
      width: P5_CANVAS.width,
      colorPrint: 196,
      color: 20,
      isDragging: false,
      isOver: false,
      offSetX: null,
      offSetY: null,
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
      if (SQUEEGEE.isDragging) {
        if (SQUEEGEE.posY < 0) {
          SQUEEGEE.posY = 0;
          SQUEEGEE.isDragging = false;
        } else if (SQUEEGEE.posY > P5_CANVAS.height - SQUEEGEE.height) {
          SQUEEGEE.posY = P5_CANVAS.height - SQUEEGEE.height;
          SQUEEGEE.progress = P5_CANVAS.height;
          SQUEEGEE.isDragging = false;
        } else {
          SQUEEGEE.posY = p5.mouseY - SQUEEGEE.offSetY;
          const PROGRESS = SQUEEGEE.posY;
          if (SQUEEGEE.progress < PROGRESS) {
            SQUEEGEE.progress = PROGRESS;
          }
        }
      }
    };

    p5.mouseMoved = () => {
      if (
        p5.mouseX > SQUEEGEE.posX &&
        p5.mouseX < SQUEEGEE.posX + SQUEEGEE.width &&
        p5.mouseY > SQUEEGEE.posY &&
        p5.mouseY < SQUEEGEE.posY + SQUEEGEE.height
      ) {
        SQUEEGEE.isOver = true;
      } else {
        SQUEEGEE.isOver = false;
      }
      if (SQUEEGEE.isOver) {
        SQUEEGEE.color = 80;
      } else {
        SQUEEGEE.color = 20;
      }
    };

    p5.mousePressed = () => {
      if (SQUEEGEE.isOver) {
        SQUEEGEE.offSetX = p5.mouseX - SQUEEGEE.posX;
        SQUEEGEE.offSetY = p5.mouseY - SQUEEGEE.posY;
        SQUEEGEE.isDragging = true;
      }
    };

    p5.mouseReleased = () => {
      SQUEEGEE.isDragging = false;
    };

    // NOTE: Set up is here
    p5.setup = () => {
      const canvas = p5.createCanvas(P5_CANVAS.width, P5_CANVAS.height);
      canvas.parent("paint-canvas");
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
      p5.fill("rgba(100%,0%,100%,0.9)");
      p5.rect(SQUEEGEE.posX, 0, SQUEEGEE.width, SQUEEGEE.progress);
      p5.fill(SQUEEGEE.color);
      p5.rect(SQUEEGEE.posX, SQUEEGEE.posY, SQUEEGEE.width, SQUEEGEE.height);
    };
  };
  new P5(script);
});
</script>
