<template>
  <div id="app">
    <!-- Always render header and sidebar -->
    <header class="app-header">
      <!-- Dynamic charger icon with styles -->
      <i
        class="fas fa-battery-quarter charger-icon"
        @mouseover="zoomIcon('charger')"
        @mouseleave="unzoomIcon('charger')"
      ></i>
      <!-- Dynamic SIM icon -->
      <i
        class="fas fa-sim-card sim-icon"
        @mouseover="zoomIcon('sim')"
        @mouseleave="unzoomIcon('sim')"
      ></i>
      <h1 class="app-heading">Pre-XTS Inventory</h1>
      <div class="header-icons">
        <!-- You can add any additional icons or buttons here -->
      </div>
    </header>
    <div class="main-content">
      <AppSidebar
        @toggle-manage="toggleManage"
        :isManageAssetsOpen="isManageAssetsOpen"
        :isManageRequestsOpen="isManageRequestsOpen"
      />
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from "./components/AppSidebar.vue";

export default {
  name: "App",
  components: {
    AppSidebar,
  },
  data() {
    return {
      isManageAssetsOpen: false,
      isManageRequestsOpen: false,
    };
  },
  methods: {
    toggleManage(section) {
      if (section === "assets") {
        this.isManageAssetsOpen = !this.isManageAssetsOpen;
        this.isManageRequestsOpen = false;
      } else if (section === "requests") {
        this.isManageRequestsOpen = !this.isManageRequestsOpen;
        this.isManageAssetsOpen = false;
      }
    },
    zoomIcon(iconType) {
      const icon = document.querySelector(`.${iconType}-icon`);
      icon.style.transform = "scale(1.1)";
      icon.style.transition = "transform 0.3s ease";
    },
    unzoomIcon(iconType) {
      const icon = document.querySelector(`.${iconType}-icon`);
      icon.style.transform = "scale(1)";
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.app-header {
  background-color: #0564b1;
  color: white;
  padding: 18px 0;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-heading {
  font-size: 2em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  flex-grow: 1;
  margin: 0;
}

.charger-icon,
.sim-icon {
  font-size: 3.5em;
  color: #0b0b0b;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-left: 10px;
  transition: transform 0.3s ease;
}

.sim-icon {
  color: #0b0b0b;
  margin-left: 5px;
}

.header-icons {
  display: flex;
  align-items: center;
}

/* .logout-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-right: 20px;
}

.logout-button i {
  margin-right: 5px;
} */

.main-content {
  display: flex;
  height: calc(100vh - 40px);
}

.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
}
</style>
