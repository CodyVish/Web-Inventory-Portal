  <template>
  <nav
    :class="{
      sidebar: true,
      'sidebar-manage-open': isManageAssetsOpen || isManageRequestsOpen,
    }"
  >
    <!-- Chargers Section -->
    <div class="manage-header" @click="toggleManageSection('manageAssets')">
      <h2 class="manage-heading">Chargers</h2>
      <span class="toggle-icon" :class="{ open: isManageAssetsOpen }"
        >&#9660;</span
      >
    </div>
    <ul v-show="isManageAssetsOpen">
      <li class="sidebar-item">
        <router-link :to="{ name: 'AddCharger' }">Add Charger</router-link>
      </li>
      <li class="sidebar-item">
        <router-link :to="{ name: 'ViewChargers' }">View Charger</router-link>
      </li>
    </ul>
    <ul>
      <li class="sidebar-item no-bullet">
        <router-link :to="{ name: 'TransferCharger' }"
          >Transfer Charger</router-link
        >
      </li>
    </ul>

    <!-- Sims Section -->
    <div class="manage-header" @click="toggleManageSection('manageSims')">
      <h2 class="manage-heading">Sims</h2>
      <span class="toggle-icon" :class="{ open: isManageSimsOpen }"
        >&#9660;</span
      >
    </div>
    <ul v-show="isManageSimsOpen">
      <li class="sidebar-item">
        <router-link :to="{ name: 'AddSim' }">Add SIM</router-link>
      </li>
      <li class="sidebar-item">
        <router-link :to="{ name: 'ViewSim' }">View SIM</router-link>
      </li>
      <li class="sidebar-item">
        <router-link :to="{ name: 'TransferSim' }">Transfer SIM</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "AppSidebar",
  props: {
    isManageAssetsOpen: Boolean,
    isManageRequestsOpen: Boolean,
  },
  data() {
    return {
      isManageSimsOpen: false,
    };
  },
  methods: {
    toggleManage(section) {
      this.$emit("toggle-manage", section);
    },
    toggleManageSection(section) {
      if (section === "manageAssets") {
        this.$emit("toggle-manage", "assets");
      } else if (section === "manageSims") {
        this.isManageSimsOpen = !this.isManageSimsOpen;
      }
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #f0f8ff; /* Very light sky blue background */
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Shadow effect */
  transition: width 0.3s ease;
}

.sidebar-manage-open {
  width: 250px; /* Adjusted width when manage section is open */
}

.manage-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Text shadow for 3D effect */
}

.manage-heading {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 0;
}

.toggle-icon {
  font-size: 1em; /* Adjust the arrow size to match the heading */
  margin-left: 10px; /* Adjust margin for spacing */
  transition: transform 0.3s ease; /* Smooth transition for rotation */
}

.toggle-icon.open {
  transform: rotate(180deg); /* Rotate the arrow when open */
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin-left: 10px;
}

.sidebar-item {
  margin: 10px 0;
  margin-left: 5px;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); /* Text shadow for 3D effect on items */
}

.sidebar-item.no-bullet {
  list-style-type: none; /* Remove bullet point */
}

.sidebar-item a {
  text-decoration: none;
  color: #2c3e50;
  display: block;
  font-size: 16px; /* Dynamic font size */
}

.sidebar-item:hover {
  background-color: #ddd;
}
</style>
