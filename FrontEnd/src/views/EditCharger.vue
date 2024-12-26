<template>
  <div>
    <h2>Edit Charger</h2>

    <!-- Search Form -->
    <form @submit.prevent="searchChargers">
      <label for="employeeId">Employee ID:</label>
      <input type="text" v-model="searchEmployeeId" id="employeeId" required />
      <button type="submit">Search Chargers</button>
    </form>

    <!-- Loading Indicator and Error Message -->
    <div v-if="loading">Loading charger details...</div>
    <div v-if="error">{{ error }}</div>

    <!-- Display message if no chargers found -->
    <div v-if="chargers && chargers.length === 0 && !loading">
      No chargers found for Employee ID: {{ searchEmployeeId }}
    </div>

    <!-- Display chargers if found -->
    <div v-if="chargers && chargers.length > 0 && !loading">
      <h3>Chargers for Employee ID: {{ searchEmployeeId }}</h3>
      <ul>
        <li v-for="charger in chargers" :key="charger.id">
          <router-link :to="{ name: 'EditChargerDetail', params: { id: charger.id } }">
            {{ charger.brand }} - {{ charger.model }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchEmployeeId: "",
      chargers: null,
      loading: false,
      error: "",
    };
  },
  methods: {
    searchChargers() {
      if (!this.searchEmployeeId.trim()) {
        this.error = "Please enter Employee ID";
        return;
      }

      this.loading = true;
      axios
        .get(
          `api/chargers?employeeId=${this.searchEmployeeId}`
        )
        .then((response) => {
          this.chargers = response.data.data;
          this.loading = false;
          this.error = "";
        })
        .catch((error) => {
          this.error = "Error fetching chargers.";
          this.loading = false;
          console.error("Error fetching chargers:", error);
        });
    },
  },
};
</script>

<style>
/* Add your custom styles here */
</style>
