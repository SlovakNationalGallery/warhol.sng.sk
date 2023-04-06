<template>
  <div class="w-full h-full bg-wall xl:flex">
    <div class="xl:h-full bg-white xl:w-3/5">
      <StencilCanvas class="mx-auto" />
    </div>
    <div class="p-16 xl:w-2/5 min-h-screen relative">
      <div class="mb-5">krok <b>1 / 5</b></div>
      <svg class="w-100 h-auto fill-none stroke-black stroke-[4px] mb-16" viewBox="0 0 660 24">
        <circle cx="12" cy="12" r="10" class="fill-black" />
        <path d="M24 12H159" />
        <circle cx="171" cy="12" r="10" />
        <path d="M183 12H318" />
        <circle cx="330" cy="12" r="10" />
        <path d="M342 12H477" />
        <circle cx="489" cy="12" r="10" />
        <path d="M501 12H636" />
        <circle cx="648" cy="12" r="10" />
      </svg>
      <h1 class="mb-8 text-2xl xl:text-5xl font-bold font-sng">Prilož a zarovnaj šablonu</h1>
      <div class="">
        <p class="mb-4">
          Text o tomto kroku. Keď spomínam Andyho Warhola isto sa vám vybavia plagáty s paradajkovou polievkou, či známe farebné portréty
          krásnej pani Marilyn. Mnoho Andyho diel bolo vytvorených práve technikou sieťotlače. Ako však sieťotlačovať Keď spomínam Andyho
          Warhola isto sa vám vybavia plagáty s paradajkovou polievkou, či známe farebné portréty krásnej pani Marilyn. Mnoho Andyho diel
          bolo vytvorených práve technikou sieťotlače. Ako však sieťotlačovať
        </p>
        <p class="mb-4">
          Text o tomto kroku. Keď spomínam Andyho Warhola isto sa vám vybavia plagáty s paradajkovou polievkou, či známe farebné portréty
          krásnej pani Marilyn. Mnoho Andyho diel bolo vytvorených práve technikou sieťotlače. Ako však sieťotlačovať Keď spomínam Andyho
          Warhola isto sa vám vybavia plagáty s paradajkovou polievkou, či známe farebné portréty krásnej pani Marilyn. Mnoho Andyho diel
          bolo vytvorených práve technikou sieťotlače. Ako však sieťotlačovať
        </p>
      </div>
      <div class="bottom-0 absolute inset-x-0 flex justify-between p-16">
          <router-link to="/" class="block uppercase font-sng font-medium text-white bg-black rounded-full text-2xl py-4 px-10">Späť</router-link>
          <router-link to="/" class="block uppercase font-sng font-medium text-white bg-black rounded-full text-2xl py-4 px-10">Ďalej</router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import StencilCanvas from "../components/StencilCanvas.vue"
</script>
