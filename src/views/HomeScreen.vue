<template>
  <div class="grid grid-rows-5 grid-cols-2 lg:grid-cols-5 lg:grid-rows-2 gap-4 mx-auto my-8 max-h-screen">
    <div class="bg-blue-200 rounded-sm flex" v-for="index in 10" :key="index">
      <img v-if="index < 10" src="https://www.webumenia.sk/dielo/nahlad/SVK:SNG.G_13273/800" :alt="'Campbell\'s Soup ' + index" class="h-full w-auto" width="522" height="800">
      <router-link v-else to="/create-soup" class="px-6 py-4 text-green-100 bg-indigo-600 rounded-lg text-2xl m-auto  d-block text-center">Create your own <br> can of soup</router-link>
    </div>
  </div>
</template>