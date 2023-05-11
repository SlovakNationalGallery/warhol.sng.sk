<template>
  <div class="w-full h-full bg-wall lg:flex select-none xl:overscroll-none xl:touch-pan-y">
    <div class="lg:h-full bg-white lg:w-3/5 relative">
      <InteractionCanvas :current-step="currentStep" :step-count="stepCount" :label-string="labelString" ref="interactionCanvasRef" />
      <div class="bg-wall absolute inset-0 items-center justify-center" id="confirmPreview" :class="showCropped ? 'flex' : 'hidden'">
        <div class="bg-white p-2.5 border-wall drop-shadow-3xl border-[14px] rounded-sm flex">
          <canvas id="croppedCanvas" ref="croppedCanvasRef"></canvas>
        </div>
      </div>
    </div>
    <div class="p-6 lg:p-16 lg:w-2/5 lg:min-h-screen bg-wall relative">
      <div class="mb-5 text-xl xl:text-2xl">
        krok <b>{{ currentStep + 1 }} / {{ stepCount }}</b>
      </div>
      <svg class="w-100 h-auto fill-none stroke-black stroke-[4px] mb-8 lg:mb-16" viewBox="0 0 660 24">
        <g v-for="(index, value) in stepCount" :key="index">
          <circle :cx="12 + (680 / stepCount) * value" cy="12" r="10" :class="{ 'fill-black': currentStep >= value }" />
          <path
            v-if="index < stepCount"
            :d="'M' + (24 + (680 / stepCount) * value) + ' 12H' + (680 / stepCount + (680 / stepCount) * value)"
          />
        </g>
      </svg>
      <h1 class="mb-8 text-2xl lg:text-5xl font-bold font-sng">{{ steps[currentStep].title }}</h1>
      <div class="text-xl xl:text-2xl pb-20">
        <div class="pb-10" v-if="stepCount - 2 === currentStep">
          <input
            :value="labelString"
            class="border-b border-black focus:border-red focus:outline-none w-full py-2 px-3 mb-4 lg:mb-8"
            type="text"
            placeholder="Enter text"
          />
          <VirtualKeyboard :input="labelString" @onChange="onLabelStringChange" />
        </div>
        <p class="mb-4 whitespace-pre-wrap">
          {{ steps[currentStep].description }}
        </p>
      </div>
      <div class="bottom-0 absolute inset-x-0 flex justify-between p-6 lg:p-16">
        <button
          :onClick="prevStep"
          class="uppercase font-sng font-medium text-black bg-wall rounded-full text-lg lg:text-2xl py-4 px-10 flex"
        >
          <svg class="h-[27px] w-[23px] fill-black mr-3" viewBox="0 0 27 23">
            <path
              d="M12.0085 22.9999L0.553955 11.5454L12.0085 0.0908203L13.9773 2.034L5.87214 10.1391H26.8636V12.9516H5.87214L13.9773 21.0312L12.0085 22.9999Z"
            />
          </svg>
          Späť
        </button>
        <button
          :onClick="nextStep"
          class="uppercase font-sng font-medium text-white bg-black rounded-full text-lg lg:text-2xl py-4 px-10 flex"
        >
          {{ isLastStep() ? "Uložiť" : "Ďalej" }}
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
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import InteractionCanvas from "../components/InteractionCanvas.vue"
import VirtualKeyboard from "../components/VirtualKeyboard.vue"
import fs from "fs"
import path from "path"

const croppedCanvasRef = ref(null)
const context = ref(null)
const interactionCanvasRef = ref(null)
const showCropped = ref(false)

const savedImages = ref([])
const labelString = ref("")
const currentStep = ref(0)
const router = useRouter()
const steps = [
  {
    title: "Priložte a zarovnajte šablónu",
    description: `Campbellova polievka od Andyho Warhola bola vytvorená technikou sieťotlače (serigrafie). Na jej vytvorenie boli použité viaceré šablóny, na každú farbu jedna.

Tu si môžete vyskúšať jej jednotlivé kroky.

Najskôr umiestnite šablónu na vopred označené orezové značky. Presné zarovnanie prvej šablóny je veľmi dôležité, pretože vytvára základ pre celé dielo a zabezpečí presné umiestnenie farieb.
`,
  },
  {
    title: "Naneste stierkou červenú farbu",
    description: `V tomto kroku autor rovnomerným tlakom prenášal farbu na plátno.

Pomocou stierky rozotrite červenú farbu po šablóne, čím napodobníte Warholovu ikonickú techniku.

Červená je prvou nanášanou farbou, pretože je na veľkej ploche diela.
    `,
  },
  {
    title: "Priložte a zarovnajte ďalšiu šablónu",
    description: `Grafiku je treba po každom nátere odložiť, aby zaschla a bola pripravená na ďalšiu vrstvu. A šablónu je potrebné po nanesení farby okamžite vyčistiť.

V tejto simulácii však môžeme hneď pokračovať.

Opatrne zarovnajte ďalšiu šablónu. Skúste uhádnuť, akú farbu budeme nanášať teraz. Na poradí farieb záleží. Viete odhadnúť, v akej postupnosti by mali nasledovať?
    `,
  },
  {
    title: "Naneste stierkou sivú farbu",
    description: `Warhol začal používať sieťotlač ako médium pre svoje diela, pretože ho fascinovala myšlienka masovej výroby a automatizácie.

Priťahovali ho predmety každodennej potreby a ikonické značky, ktoré boli rozšírené v americkej spoločnosti, a snažil sa ich zakomponovať do svojich umeleckých diel.

Prostredníctvom sieťotlače mohol Warhol vytvárať umelecké diela, ktoré sa dali reprodukovať vo veľkých množstvách, čím sa stali dostupnejšími pre širšie publikum.
    `,
  },
  {
    title: "Priložte a zarovnajte šablónu",
    description: `Technikou sieťotlače vznikajú diela, ktoré sa na prvý pohľad môžu javiť rovnaké, avšak vždy sú tu prítomné drobné odchýlky.

Aj vďaka nim dostávajú punc rukodielnej práce umelca.
    `,
  },
  {
    title: "Naneste stierkou bielu farbu",
    description: `V kontexte sieťotlače nie je stanovené žiadne striktné pravidlo, ktoré by definovalo presný počet výtlačkov považovaných za „originálne umelecké dielo“.

Počet originálov sa môže líšiť v závislosti od rôznych faktorov, ako je umelecký zámer, umelecké konvencie a právne predpisy.

Konkrétny počet výtlačkov v edícii sa často určuje na základe rozhodnutia umelca či umelkyne alebo dohody s galériou.
    `,
  },
  {
    title: "Priložte a zarovnajte šablónu",
    description: `Na trhu s umením sa limitované edície sieťotlačí zvyčajne pohybujú od niekoľkých výtlačkov až po niekoľko stoviek, pričom každý výtlačok je podpísaný a očíslovaný umelcom, umelkyňou. `,
  },
  {
    title: "Naneste stierkou zlatú farbu",
    description: `Môžeme sa len domnievať, ako by Andy Warhol pristúpil k súčasným technológiám.

V jednom z rozhovorov zo 60. rokov však na otázku, ako by sa vyrovnal s výzvou automatizácie, odpovedal:
„Tým, že sa stanem jej súčasťou.“
    `,
  },
  {
    title: "Zarovnaj poslednú šablónu",
    description: `Úlohou tejto šablóny je okrem iného prekryť drobné nedokonalosti a zjednotiť plochy.`,
  },
  {
    title: "Naneste stierkou čiernu farbu",
    description: `Čierna farba slúži ako záverečná vrstva. Dodáva dielu hĺbku a kontrast, zvýrazňuje obrysy a zvyšuje jeho vizuálny účinok.`,
  },
  {
    title: "Akú polievku si dáte dnes?",
    description: `Andy Warhol dopisoval názvy polievok ručne. Každá sa volala inak. Pravdepodobne ich všetky dobre poznal, konzumoval ich totiž každý deň.

Vpíšte sem názov svojej obľúbenej polievky.
    `,
  },
  {
    title: "Hotovo?",
    description: `Grafika je vytlačená. Čas na poslednú kontrolu kvality. Vyzerá to skutočne tak, ako ste chceli?

Ak áno, nastal by čas orezať ju, podpísať a zarámovať...

Ak treba niečo zmeniť, posunúť či napraviť, v realite by ste museli začať odznova. Tu sa však v každom kroku môžete vrátiť späť.

Andy Warhol vystavoval Campbellove polievky vždy v sériách. Ak je vaše dielo v poriadku, môžete ho pridať do našej zbierky.
`,
  },
]

const onLabelStringChange = (newLabelString) => {
  labelString.value = newLabelString
}

const stepCount = steps.length

const nextStep = () => {
  if (currentStep.value >= stepCount - 1) {
    saveCanvas()
    router.push("/")
    return
  }
  currentStep.value += 1
  if (isLastStep()) {
    cropCanvas()
  }
}

const prevStep = () => {
  if (currentStep.value <= 0) {
    router.push("/")
    return
  }
  if (showCropped.value === true) {
    clearCanvas()
  }
  currentStep.value -= 1
}

const saveCanvas = async () => {
  const c = croppedCanvasRef.value
  const dataUrl = c.toDataURL()

  if (!process.env.IS_ELECTRON) {
    const response = await fetch(process.env.VUE_APP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: dataUrl }),
    })
    const data = await response.text()
    return data
  }

  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "")

  const buffer = Buffer.from(base64Data, "base64")
  const fileName = `canvas_${Date.now()}.png` // Use a dynamic filename with a timestamp
  const saveDir = "saved_cans"

  // Check if the save directory exists, create it if it doesn't
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir)
  }

  // Use Electron's built-in "fs" module to save the image locally
  const filePath = path.join(saveDir, fileName)
  fs.writeFileSync(filePath, buffer)

  // Add the saved image to the gallery
  savedImages.value.push(fileName)
}

const cropCanvas = () => {
  showCropped.value = true

  const c = document.getElementById("defaultCanvas0")
  const width = interactionCanvasRef.value.printCanvas.width
  const height = interactionCanvasRef.value.printCanvas.height
  const startX = (interactionCanvasRef.value.interactionCanvas.width - width) / 2
  const startY = (interactionCanvasRef.value.interactionCanvas.height - height) / 2
  const ratio = c.width / interactionCanvasRef.value.interactionCanvas.width
  croppedCanvasRef.value.width = width
  croppedCanvasRef.value.height = height

  context.value.drawImage(
    c,
    startX,
    startY,
    width * ratio,
    height * ratio, // source rect with content to crop
    0,
    0,
    width,
    height
  )
}

const clearCanvas = () => {
  context.value.clearRect(0, 0, context.value.canvas.width, context.value.canvas.height)
  showCropped.value = false
}

const isLastStep = () => {
  return currentStep.value == stepCount - 1
}

onMounted(() => {
  context.value = croppedCanvasRef.value?.getContext("2d") || undefined
})
</script>
