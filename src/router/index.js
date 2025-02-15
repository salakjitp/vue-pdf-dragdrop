import { createRouter, createWebHistory } from "vue-router";
import NotFoundView from '@/views/NotFoundView.vue';
import ContentLayout from "@/components/layouts/ContentLayout.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: ContentLayout,
            children: [
                {
                    name: "HomePage",
                    path: "home",
                    component: () => import("../views/HomeView.vue"),
                },
                {
                    name: "AboutPage",
                    path: "about",
                    component: () => import("../views/AboutView.vue"),
                },
            ],
        },
        {
            path: "",
            redirect: { name: "HomePage" },
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView,
        },
    ]
});

export default router;