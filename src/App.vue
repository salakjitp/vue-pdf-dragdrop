<script setup>
import { RouterView } from 'vue-router';
import Header from "@/components/layouts/Header.vue";
import Footer from '@/components/layouts/Footer.vue';
</script>

<template>
  <Header></Header>
  <RouterView />
  <Footer></Footer>
</template>
