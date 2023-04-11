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
let pointer;


const p5sketch = (sketch) => {
  sketch.setup = () => {
    // sketch.createCanvas(400, 400);
    // sketch.background(100);
    const canvas = sketch.createCanvas(400, 400);
    canvas.parent('stencilCanvas'); // Append the canvas to the DOM
    pointer = sketch.createVector();
  };

  sketch.draw = () => {
    sketch.background(220);
    // Draw the ellipse at the current x and y coordinates
    sketch.ellipse(x, y, 50, 50);
  };

    sketch.touchStarted = () => {
    // Check if the touch is over the ellipse
    if (typeof sketch.touches !== 'undefined' && sketch.touches.length > 0) {
        pointer.set(sketch.touches[0].x, sketch.touches[0].y);
    } else {
        pointer.set(sketch.mouseX, sketch.mouseY);
    }

    if (sketch.dist(pointer.x, pointer.y, x, y) < 25) {
      isDragging.value = true; // Start dragging the ellipse
    }
  };

  sketch.touchMoved = () => {
    
    if (isDragging.value) {
    
            if (typeof sketch.touches !== 'undefined' && sketch.touches.length > 0) {
            pointer.set(sketch.touches[0].x, sketch.touches[0].y);
        } else {
            pointer.set(sketch.mouseX, sketch.mouseY);
        }

      x = pointer.x;
      y = pointer.y;
    }
  };

  sketch.touchEnded = () => {
    pointer.set();
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
