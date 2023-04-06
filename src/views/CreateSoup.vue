<template>
  <div class="w-full h-full bg-wall xl:flex">
    <div class="xl:h-full bg-white xl:w-3/5">
      <StencilCanvas class="mx-auto" />
    </div>
    <div class="p-16 xl:w-2/5 min-h-screen relative">
      <div class="mb-5 text-xl">
        krok <b>{{ step }} / 5</b>
      </div>
      <svg class="w-100 h-auto fill-none stroke-black stroke-[4px] mb-16" viewBox="0 0 660 24">
        <circle cx="12" cy="12" r="10" :class="{ 'fill-black': step > 0 }" />
        <path d="M24 12H159" />
        <circle cx="171" cy="12" r="10" :class="{ 'fill-black': step > 1 }" />
        <path d="M183 12H318" />
        <circle cx="330" cy="12" r="10" :class="{ 'fill-black': step > 2 }" />
        <path d="M342 12H477" />
        <circle cx="489" cy="12" r="10" :class="{ 'fill-black': step > 3 }" />
        <path d="M501 12H636" />
        <circle cx="648" cy="12" r="10" :class="{ 'fill-black': step > 4 }" />
      </svg>
      <h1 class="mb-8 text-2xl xl:text-5xl font-bold font-sng">Prilož a zarovnaj šablonu</h1>
      <div class="text-xl">
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
        <button :onClick="prevStep" class="uppercase font-sng font-medium text-black bg-wall rounded-full text-2xl py-4 px-10 flex">
          <svg class="h-[27px] w-[23px] fill-black mr-3" viewBox="0 0 27 23">
            <path
              d="M12.0085 22.9999L0.553955 11.5454L12.0085 0.0908203L13.9773 2.034L5.87214 10.1391H26.8636V12.9516H5.87214L13.9773 21.0312L12.0085 22.9999Z"
            />
          </svg>
          Späť
        </button>
        <button :onClick="nextStep" class="uppercase font-sng font-medium text-white bg-black rounded-full text-2xl py-4 px-10 flex">
          Ďalej
          <svg class="h-[27px] w-[23px] fill-white ml-3" viewBox="0 0 27 23">
            <path
              d="M14.9913 8.96454e-05L26.4458 11.4546L14.9913 22.9092L13.0225 20.966L21.1276 12.8609L0.136141 12.8609V10.0484L21.1276 10.0484L13.0225 1.96884L14.9913 8.96454e-05Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import StencilCanvas from "../components/StencilCanvas.vue"

const step = ref(1)
const router = useRouter()

const nextStep = () => {
  step.value += 1
}

const prevStep = () => {
  step.value -= 1
  if (step.value < 1) {
    router.push("/")
  }
}
</script>
