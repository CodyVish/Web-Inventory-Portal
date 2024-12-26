import { createRouter, createWebHistory } from "vue-router";

// Lazy load the components
const AddCharger = () => import("../views/AddCharger.vue");
const ViewChargers = () => import("../views/ViewChargers.vue");
const EditCharger = () => import("../views/EditCharger.vue");
const EditChargerDetail = () => import("../views/EditChargerDetail.vue");
const TransferCharger = () => import("../views/TransferCharger.vue");
const AddSim = () => import("../views/AddSim.vue");
const ViewSim = () => import("../views/ViewSim.vue");
const EditSimDetails = () => import("../views/EditSimDetails.vue");
const TransferSim = () => import("../views/TransferSim.vue");

const routes = [
  {
    path: "/",
    name: "AddCharger",
    component: AddCharger,
    meta: { requiresAuth: true },
  },
  {
    path: "/view-chargers",
    name: "ViewChargers",
    component: ViewChargers,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-charger",
    name: "EditCharger",
    component: EditCharger,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-charger/:id",
    name: "EditChargerDetail",
    component: EditChargerDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/transfer-charger",
    name: "TransferCharger",
    component: TransferCharger,
    meta: { requiresAuth: true },
  },
  {
    path: "/add-sim",
    name: "AddSim",
    component: AddSim,
    meta: { requiresAuth: true },
  },
  {
    path: "/view-sim",
    name: "ViewSim",
    component: ViewSim,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-sim-details/:id",
    name: "EditSimDetail",
    component: EditSimDetails,
    props: true,
    meta: { requiresAuth: true },
  }, // Route for EditSimDetail.vue with props
  {
    path: "/transfer-sim",
    name: "TransferSim",
    component: TransferSim,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
