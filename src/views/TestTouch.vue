<template>
    <div>
        <h1>aha</h1>
        <div>
            <div id="stencilCanvas" ref="sketchContainer" class="w-96 h-96"></div>
        </div>
    </div>
  
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue';
import p5 from 'p5';

let x = 100; // Initial x-coordinate of the ellipse
let y = 100; // Initial y-coordinate of the ellipse
let isDragging = ref(false); // Flag to indicate if the ellipse is being dragged
// let canvas; // Reference to the p5.js canvas
// const canvas = ref(null)
const sketchContainer = ref(null)

const p5sketch = (sketch) => {
  sketch.setup = () => {
    // sketch.createCanvas(400, 400);
    // sketch.background(100);
    const canvas = sketch.createCanvas(400, 400);
    canvas.parent('stencilCanvas'); // Append the canvas to the DOM
  };

  sketch.draw = () => {
    sketch.background(220);
    // Draw the ellipse at the current x and y coordinates
    sketch.ellipse(x, y, 50, 50);
  };

  sketch.mousePressed = () => {
    // Check if the mouse is over the ellipse
    console.log(sketch.mouseX);
    if (sketch.dist(sketch.mouseX, sketch.mouseY, x, y) < 25) {
      isDragging.value = true; // Start dragging the ellipse
    }
  };

  sketch.mouseReleased = () => {
    isDragging.value = false; // Stop dragging the ellipse
  };

    sketch.mouseDragged = () => {
    if (isDragging.value) {
      // Update the ellipse coordinates based on touch movement
      x = sketch.mouseX;
      y = sketch.mouseY;
    }
  };



    sketch.touchStarted = () => {
    // Check if the touch is over the ellipse
    const touch = sketch.touches[0];
    if (touch && sketch.dist(touch.x, touch.y, x, y) < 25) {
      isDragging.value = true; // Start dragging the ellipse
    }
  };

  sketch.touchMoved = () => {
    if (isDragging.value) {
      // Update the ellipse coordinates based on touch movement
      const touch = sketch.touches[0];
      if (touch) {
        x = touch.x;
        y = touch.y;
      }
    }
  };

  sketch.touchEnded = () => {
    isDragging.value = false; // Stop dragging the ellipse
  };
};

let sketchObject

onMounted(() => {
    // Mount the p5.js sketch after the Vue component is mounted
    sketchObject = new p5(p5sketch, sketchContainer.value);
})
// Clean up the p5.js sketch before the Vue component is unmounted
onBeforeUnmount(() => {
  sketchObject.remove();
});
</script>

<style scoped>
#stencilCanvas {
  touch-action: none; /* Prevent scrolling or scaling on touch devices */
}
</style>
