<template>
  <div class="w-full h-full bg-wall lg:flex">
    <div class="lg:h-full bg-white lg:w-3/5">
      <InteractionCanvas :current-step="currentStep" :step-count="stepCount" :label-string="labelString" />
    </div>
    <div class="p-8 lg:p-16 lg:w-2/5 min-h-screen bg-wall relative">
      <div class="mb-5 text-xl">
        krok <b>{{ currentStep + 1 }} / {{ stepCount }}</b>
      </div>
      <svg class="w-100 h-auto fill-none stroke-black stroke-[4px] mb-8 lg:mb-16" viewBox="0 0 660 24">
        <g v-for="(index, value) in stepCount" :key="index">
          <circle :cx="12 + 159 * value" cy="12" r="10" :class="{ 'fill-black': currentStep >= value }" />
          <path :d="'M' + (24 + 159 * value) + ' 12H' + (159 + 159 * value)" />
        </g>
      </svg>
      <h1 class="mb-8 text-2xl lg:text-5xl font-bold font-sng">{{ steps[currentStep].title }}</h1>
      <div class="text-xl pb-20">
        <input v-if="stepCount - 1 === currentStep"  v-model="labelString" class="border-b border-black focus:border-red focus:outline-none w-full py-2 px-3 mb-4" type="text" placeholder="Enter text">

        <p class="mb-4">
          {{ steps[currentStep].description }}
        </p>
      </div>
      <div class="bottom-0 absolute inset-x-0 flex justify-between p-8 lg:p-16">
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
import InteractionCanvas from "../components/InteractionCanvas.vue"

const labelString = ref('');
const currentStep = ref(0)
const router = useRouter()
const stepCount = 5

const steps = [
  {
    title: "Prilož a zarovnaj šablónu",
    description: "This is the first step",
  },
  {
    title: "Nanes stierkou farbu",
    description: "This is the second step",
  },
  {
    title: "Zrovnaj ďaľšiu šaplónu",
    description: "This is the third step",
  },
  {
    title: "Opäť nanes stierkou farbu",
    description: "This is the third step",
  },
  {
    title: "Ako sa bude volať?",
    description: "Andy Warhol dopisoval názvy polievok ručne. Každá sa volala inak. Pravdepodobne ich všetky dobre poznal. Konzumloval ich totiž každý deň.",
  },
  // {
  //   title: "Hotovo?",
  //   description: "This is the third step",
  // },
]

const nextStep = () => {
  currentStep.value += 1
  if (currentStep.value >= stepCount) {
    // @todo confirm and save
    router.push("/")
  }
}

const prevStep = () => {
  currentStep.value -= 1
  if (currentStep.value < 0) {
    router.push("/")
  }
}
</script>
