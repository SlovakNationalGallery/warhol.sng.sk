<template>
  <div class="w-full h-full bg-wall">
    <div class="grid grid-rows-5 grid-cols-2 lg:grid-cols-5 lg:grid-rows-2 !gap-[120px] w-full p-28">
      <div class="bg-white p-2.5 border-wall drop-shadow-3xl border-[14px] rounded-sm flex" v-for="index in 10" :key="index">
        <img src="../assets/can.png" :alt="'Campbell\'s Soup ' + index" class="h-full w-auto mx-auto" width="218" height="330" />
      </div>
    </div>
    <router-link
      to="/create-soup"
      class="px-4 py-4 xl:py-8 text-white bg-black text-2xl font-medium block text-center w-100 absolute inset-x-0 bottom-0"
    >
      Create your own can of soup
      <svg width="63" height="52" viewBox="0 0 63 52" class="w-8 h-auto fill-none stroke-white inline-block ml-2">
        <path d="M0 26H59" stroke-width="6" />
        <path d="M35 49L58 26L35 3" stroke-width="6" />
      </svg>
    </router-link>
  </div>
</template>
