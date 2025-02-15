<script setup>
    import { RouterView } from 'vue-router';

</script>

<template>
    <div id="ContentLayout"  class="container mx-auto px-4 h-fit min-h-screen">
        <main class="py-2">
            <router-view></router-view>
        </main>
    </div>
</template>
