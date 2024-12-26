<template>
  <div>
    <h2 class="transfer-heading">Transfer SIM</h2>

    <!-- Search Form -->
    <form @submit.prevent="fetchSims" class="search-form">
      <label for="searchEmployeeId">Search SIMs by Employee ID:</label>
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
    <div v-if="loading" class="loading-message">Loading SIMs...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- SIM List -->
    <div v-if="sims.length > 0" class="sim-list">
      <h3>SIMs for Employee ID: {{ searchEmployeeId }}</h3>
      <div v-for="sim in sims" :key="sim.id" class="sim-item">
        <input
          type="checkbox"
          v-model="selectedSims"
          :value="sim.id"
          class="checkbox-input"
        />
        <label class="sim-label"
          >{{ sim.mobile_number }} - {{ sim.operator }}</label
        >
      </div>

      <!-- New Employee ID and Transfer Button -->
      <form @submit.prevent="transferSims" class="transfer-form">
        <label for="newEmployeeId">New Employee ID:</label>
        <input
          type="text"
          v-model="newEmployeeId"
          id="newEmployeeId"
          required
          class="form-input"
        />

        <button type="submit" class="btn-primary">Transfer SIMs</button>
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
      sims: [],
      loading: false,
      error: "",
      selectedSims: [],
      newEmployeeId: "",
    };
  },
  methods: {
    fetchSims() {
      this.loading = true;
      this.error = ""; // Clear any previous error messages
      axios
        .get(
          `api/sims/by-employee/${this.searchEmployeeId}`
        )
        .then((response) => {
          this.sims = response.data.data;
          this.loading = false;
          this.error = "";
        })
        .catch((error) => {
          this.loading = false;
          if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            this.error = `Error: ${error.response.data.message || error.response.statusText}`;
          } else if (error.request) {
            // The request was made but no response was received
            this.error = "Error: No response received from the server.";
          } else {
            // Something happened in setting up the request that triggered an Error
            this.error = `Error: ${error.message}`;
          }
          console.error("Error fetching SIMs:", error);
        });
    },
    transferSims() {
      const ids = this.selectedSims;
      axios
        .put("api/transfer-sims", {
          simIds: ids,
          newEmployeeId: this.newEmployeeId,
        })
        .then((response) => {
          if (response.data.success) {
            this.$router.push("/view-sims");
          }
        })
        .catch((error) => {
          console.error("Error transferring SIMs:", error);
        });
    },
  },
};
</script>

<style scoped>
.transfer-heading {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
.search-form {
  margin-bottom: 20px;
}
.loading-message,
.error-message {
  margin-bottom: 10px;
  text-align: center;
  color: red;
}
.sim-list {
  margin-top: 20px;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.sim-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.checkbox-input {
  margin-right: 10px;
}
.sim-label {
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
  width: 200px;
}
.btn-primary {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
