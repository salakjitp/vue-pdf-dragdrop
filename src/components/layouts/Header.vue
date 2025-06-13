<script setup>
import { RouterLink, useRoute } from 'vue-router';
import logo from '@/assets/img/logo.png';

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};
</script>

<template>
  <nav class="bg-linear-to-t from-indigo-400 to-indigo-200">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
          class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Logo -->
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/">
            <img class="h-10 w-auto" :src="logo" alt="Vue Drag&Drop (Demo)" />
            <span class="hidden md:block text-black text-2xl font-bold ml-2"
              >Vue Drag&Drop (Demo)</span
            >
          </RouterLink>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <RouterLink
                to="/"
                :class="[
                  isActiveLink('/') || isActiveLink('/home')
                    ? 'bg-green-900'
                    : 'hover:bg-gray-700 hover:text-white',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >Home</RouterLink
              >
              <RouterLink
                to="/about"
                :class="[
                  isActiveLink('/about')
                    ? 'bg-green-900'
                    : 'hover:bg-gray-800 hover:text-white',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >About</RouterLink
              >
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>