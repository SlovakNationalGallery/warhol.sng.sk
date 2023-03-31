<template>
  <div id="interaction-canvas"></div>
</template>

<script setup>
import { onMounted } from "vue";

/* eslint-disable */
onMounted(() => {
  // NOTE: Use p5 as an instance mode
  const P5 = require("p5");
  const script = function (p5) {
    const P5_CANVAS = {
      width: 800,
      height: 800
    }

    const SCREEN_PRINT_CANVAS = {
      width: 200,
      height: 325,
      posX: (P5_CANVAS.width - 200) / 2,
      posY: (P5_CANVAS.height - 325) / 2
    }

    // NOTE: Set up is here
    p5.setup = (_) => {
      const canvas = p5.createCanvas(P5_CANVAS.width, P5_CANVAS.height);
      canvas.parent("interaction-canvas");
    };

    p5.draw = (_) => {
      p5.background(220);
      p5.fill(255);
      p5.rect(
        SCREEN_PRINT_CANVAS.posX,
        SCREEN_PRINT_CANVAS.posY,
        SCREEN_PRINT_CANVAS.width,
        SCREEN_PRINT_CANVAS.height
      );
    };
  };
  new P5(script);
})
</script>
