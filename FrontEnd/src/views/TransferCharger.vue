<template>
  <div>
    <h2 class="transfer-heading">Transfer Charger</h2>

    <!-- Search Form -->
    <form @submit.prevent="fetchChargers" class="search-form">
      <label for="searchEmployeeId">Search Chargers by Employee ID:</label>
      <input
        type="text"
        v-model="searchEmployeeId"
        id="searchEmployeeId"
        required
        class="form-input"
      />
      <button type="submit" class="btn-primary">Search</button>
    </form>

    <!-- Loading Indicator and Error Message -->
    <div v-if="loading" class="loading-message">Loading chargers...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- Charger List -->
    <div v-if="chargers.length > 0" class="charger-list">
      <h3>Chargers for Employee ID: {{ searchEmployeeId }}</h3>
      <div v-for="charger in chargers" :key="charger.id" class="charger-item">
        <input
          type="checkbox"
          v-model="selectedChargers"
          :value="charger.id"
          class="checkbox-input"
        />
        <label class="charger-label"
          >{{ charger.brand }} - {{ charger.model }}</label
        >
      </div>

      <!-- New Employee ID and Transfer Button -->
      <form @submit.prevent="transferChargers" class="transfer-form">
        <label for="newEmployeeId">New Employee ID:</label>
        <input
          type="text"
          v-model="newEmployeeId"
          id="newEmployeeId"
          required
          class="form-input"
        />

        <button type="submit" class="btn-primary">Transfer Chargers</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchEmployeeId: "",
      chargers: [],
      loading: false,
      error: "",
      selectedChargers: [],
      newEmployeeId: "",
    };
  },
  methods: {
    fetchChargers() {
      this.loading = true;
      axios
        .get(`api/chargers/${this.searchEmployeeId}`)
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
    transferChargers() {
      const ids = this.selectedChargers;
      axios
        .put("api/transfer-chargers", {
          chargerIds: ids,
          newEmployeeId: this.newEmployeeId,
        })
        .then((response) => {
          if (response.data.success) {
            this.$router.push("/view-chargers");
          }
        })
        .catch((error) => {
          console.error("Error transferring chargers:", error);
        });
    },
  },
};
</script>

<style scoped>
.transfer-heading {
  color: #333; /* Heading color */
  text-align: center;
  margin-bottom: 20px;
  /* Add 3D shadow effect */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
.search-form {
  margin-bottom: 20px;
}
.loading-message,
.error-message {
  margin-bottom: 10px;
  text-align: center;
  color: red; /* Error message color */
}
.charger-list {
  margin-top: 20px;
  padding: 20px;
  background-color: #f4f4f4; /* Background color */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Shadow effect */
}
.charger-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.checkbox-input {
  margin-right: 10px;
}
.charger-label {
  font-size: 16px;
}
.transfer-form {
  margin-top: 20px;
}
.form-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 200px; /* Adjust input width */
}
.btn-primary {
  padding: 10px 20px;
  background-color: #007bff; /* Button primary color */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-primary:hover {
  background-color: #0056b3; /* Button hover color */
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
