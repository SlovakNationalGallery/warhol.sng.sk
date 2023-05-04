<template>
  <div class="w-full h-full bg-wall flex flex-col select-none xl:overscroll-none xl:touch-pan-y">
    <div
      v-if="savedImages"
      class="grow grid grid-rows-5 grid-cols-2 lg:grid-cols-5 lg:grid-rows-2 gap-4 md:gap-x-14 md:gap-y-10 2xl:!gap-x-[120px] 2xl:!gap-y-[80px] w-full px-16 py-8 2xl:px-28 2xl:py-20"
    >
      <div
        class="bg-white p-2.5 border-wall drop-shadow-3xl border-[14px] rounded-sm flex"
        v-for="(image, index) in savedImages"
        :key="index"
      >
        <img :src="getImageDataUrl(image)" :alt="'Campbell\'s Soup ' + index" class="h-full w-auto mx-auto" width="218" height="330" />
      </div>
    </div>
    <router-link
      to="/create-soup"
      class="font-sng px-4 py-4 xl:py-8 hover:text-green group text-white bg-black text-3xl 2xl:text-6xl font-medium block text-center w-100"
    >
      Vytvorte si vlastnú polievku
      <svg
        viewBox="0 0 63 52"
        class="w-8 2xl:w-14 h-auto fill-none stroke-white group-hover:stroke-green inline-block ml-4 2xl:ml-6 animate-bounce"
      >
        <path d="M0 26H59" stroke-width="6" />
        <path d="M35 49L58 26L35 3" stroke-width="6" />
      </svg>
    </router-link>
  </div>
</template>

<script setup>

import fs from "fs"
import path from "path"
import { ref, onMounted } from "vue"

const savedImages = ref(null);
const saveDir = "saved_cans"

const readSavedImages = async () => {
  if (!process.env.IS_ELECTRON) {
    const response = await fetch(process.env.VUE_APP_API_URL);
    const data = await response.json();
    savedImages.value = data;
    return
  }
  if (fs.existsSync(saveDir)) {
    const files = fs
      .readdirSync(saveDir)
      .filter((file) => file.endsWith(".png"))
      .sort()
      .reverse()
      .slice(0, 10)
    savedImages.value = files.map((file) => path.join(saveDir, file))
  }
}

const getImageDataUrl = (imagePath) => {
  if (!process.env.IS_ELECTRON) {
    return imagePath;
  }
  try {
    // Read the image file content in Base64 format
    const imageContent = fs.readFileSync(imagePath, { encoding: "base64" })

    // Return the data URL for the image
    return `data:image/png;base64,${imageContent}`
  } catch (err) {
    console.error(`Error reading image file ${imagePath}:`, err)
    return null
  }
}

onMounted(readSavedImages);

</script>
