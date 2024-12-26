<template>
  <div>
    <h2 class="edit-sim-heading">Edit SIM Details</h2>
    <div v-if="loading" class="loading-indicator">Loading SIM details...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <form @submit.prevent="updateSimDetails" class="edit-form">
      <label for="employeeId" class="form-label">Employee ID:</label>
      <input type="text" id="employeeId" v-model="simDetails.employee_id" required class="form-input" />

      <label for="mobileNumber" class="form-label">Mobile Number:</label>
      <input type="text" id="mobileNumber" v-model="simDetails.mobile_number" readonly class="form-input read-only" />

      <label for="operator" class="form-label">Operator:</label>
      <input type="text" id="operator" v-model="simDetails.operator" readonly class="form-input read-only" />

      <label for="status" class="form-label">Status:</label>
      <select id="status" v-model="simDetails.status" required class="form-select">
        <option disabled value="">Select Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Lost">Lost</option>
        <option value="Data Not Working">Data Not Working</option>
        <option value="Call Not Working">Call Not Working</option>
        <option value="Damage">Damage</option>
        <option value="Returned to inventory">Returned to inventory</option>
        <option value="Wrong entry">Wrong entry</option>
      </select>

      <label for="purchaseDate" class="form-label">Purchase Date:</label>
      <input type="date" id="purchaseDate" v-model="simDetails.purchase_date" readonly class="form-input read-only" />

      <button type="submit" class="submit-btn">Update SIM Details</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditSimDetails",
  data() {
    return {
      simDetails: {
        employee_id: "",
        mobile_number: "",
        operator: "",
        purchase_date: "",
        status: "",
      },
      loading: false,
      error: "",
      simId: this.$route.params.id,
    };
  },
  created() {
    this.fetchSimDetails();
  },
  methods: {
    async fetchSimDetails() {
      try {
        this.loading = true;
        const response = await axios.get(
          `api/sim/${this.simId}`
        );
        console.log("fetchSimDetails data:", response.data); // Log the data being sent
        const simData = response.data.data;
        // Assuming simDetails.purchase_date is '2024-07-03T18:30:00.000Z'
        const isoDate = new Date(simData.purchase_date);
        simData.purchase_date = isoDate.toISOString().split("T")[0]; // '2024-07-03'
        this.simDetails = simData; // Assign filtered data to this.simDetails
        this.loading = false;
        this.error = "";
      } catch (error) {
        this.handleError(error, "Error fetching SIM details");
      }
    },
    async updateSimDetails() {
      try {
        this.loading = true;
        console.log("Sending data:", this.simDetails); // Log the data being sent
        await axios.put(
          `api/updatesim/${this.simId}`,
          this.simDetails
        );
        this.loading = false;
        this.$router.push({ name: "ViewSim" }); // Redirect to ViewSIMs after successful update
      } catch (error) {
        this.handleError(error, "Error updating SIM details");
      }
    },
    handleError(error, customMessage) {
      console.error(customMessage, error);
      this.error = customMessage;
      if (error && error.response) {
        this.error += `: ${error.response.data.message || error.response.status}`;
      } else if (error && error.request) {
        this.error += ": No response received from the server.";
      } else if (error) {
        this.error += `: ${error.message}`;
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.edit-sim-heading {
  color: black;
  text-align: center;
  margin-bottom: 20px;
}

.loading-indicator {
  margin-top: 20px;
  text-align: center;
  font-style: italic;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.edit-form {
  margin: auto;
  max-width: 400px;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-label {
  margin-bottom: 5px;
  color: #333;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-select {
  background-color: white;
}

.form-input.read-only {
  background-color: #e9ecef;
  pointer-events: none;
  opacity: 0.6;
}

.submit-btn {
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  font-size: 16px;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>
