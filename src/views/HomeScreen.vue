<template>
  <div class="w-full h-full bg-wall flex flex-col">
    <div class="grow grid grid-rows-5 grid-cols-2 lg:grid-cols-5 lg:grid-rows-2 gap-4 md:gap-x-14 md:gap-y-10 2xl:!gap-x-[120px] 2xl:!gap-y-[80px] w-full px-16 py-8 2xl:px-28 2xl:py-20">
      <div class="bg-white p-2.5 border-wall drop-shadow-3xl border-[14px] rounded-sm flex" v-for="index in 10" :key="index">
        <img src="../assets/can.png" :alt="'Campbell\'s Soup ' + index" class="h-full w-auto mx-auto" width="218" height="330" />
      </div>
    </div>
    <router-link
      to="/create-soup"
      class="font-sng px-4 py-4 xl:py-8 hover:text-red group text-white bg-black text-3xl 2xl:text-6xl font-medium block text-center w-100"
    >
      Vytvor si vlastnú polievku
      <svg width="63" height="52" viewBox="0 0 63 52" class="w-8 xl:w-14 h-auto fill-none stroke-white group-hover:stroke-red inline-block ml-2">
        <path d="M0 26H59" stroke-width="6" />
        <path d="M35 49L58 26L35 3" stroke-width="6" />
      </svg>
    </router-link>
  </div>
</template>
