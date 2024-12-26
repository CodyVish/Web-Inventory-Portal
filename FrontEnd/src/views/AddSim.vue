<template>
  <div>
    <h2 class="add-sim-heading">Add SIM Information</h2>
    <div class="add-sim-form">
      <div class="form-group">
        <label for="employeeId" class="form-label"
          >Employee ID: <span class="required-field">*</span></label
        >
        <input
          type="text"
          v-model="simData.employeeId"
          placeholder="Employee ID"
          class="form-input"
        />
        <p v-if="errors.employeeId" class="error">{{ errors.employeeId }}</p>
      </div>

      <div class="form-group">
        <label for="mobileNumber" class="form-label"
          >Mobile Number: <span class="required-field">*</span></label
        >
        <input
          type="text"
          v-model="simData.mobileNumber"
          placeholder="Mobile Number"
          class="form-input"
        />
        <p v-if="errors.mobileNumber" class="error">
          {{ errors.mobileNumber }}
        </p>
      </div>

      <div class="form-group">
        <label for="operator" class="form-label"
          >Operator: <span class="required-field">*</span></label
        >
        <select
          v-model="simData.operator"
          id="operator"
          class="form-select"
          @change="checkOperator"
        >
          <option disabled value="">Select Operator</option>
          <option v-for="op in operators" :key="op" :value="op">
            {{ op }}
          </option>
          <option value="Others">Others</option>
        </select>
        <p v-if="errors.operator" class="error">{{ errors.operator }}</p>
      </div>

      <div class="form-group" v-if="simData.operator === 'Others'">
        <label for="otherOperator" class="form-label"
          >Other Operator: <span class="required-field">*</span></label
        >
        <input
          type="text"
          v-model="simData.otherOperator"
          placeholder="Other Operator"
          class="form-input"
        />
        <p v-if="errors.otherOperator" class="error">
          {{ errors.otherOperator }}
        </p>
      </div>

      <div class="form-group">
        <label for="purchaseDate" class="form-label"
          >Purchase Date: <span class="required-field">*</span></label
        >
        <input type="date" v-model="simData.purchaseDate" class="form-input" />
        <p v-if="errors.purchaseDate" class="error">
          {{ errors.purchaseDate }}
        </p>
      </div>

      <div class="form-group">
        <label for="status" class="form-label"
          >Status: <span class="required-field">*</span></label
        >
        <select v-model="simData.status" id="status" class="form-select">
          <option disabled value="">Select Status</option>
          <option v-for="stat in statuses" :key="stat" :value="stat">
            {{ stat }}
          </option>
        </select>
        <p v-if="errors.status" class="error">{{ errors.status }}</p>
      </div>

      <button @click="addSim" :disabled="loading" class="submit-btn">
        {{ loading ? "Adding..." : "Add SIM" }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AddSim",
  data() {
    return {
      simData: {
        employeeId: "",
        mobileNumber: "",
        operator: "",
        otherOperator: "",
        purchaseDate: "",
        status: "",
      },
      loading: false,
      error: null,
      errors: {},
      operators: ["Airtel", "Vodafone", "Jio"],
      statuses: [
        "Active",
        "Not Active",
        "Lost",
        "Data Not Working",
        "Call Not Working",
        "Damage",
        "Returned to inventory",
      ],
    };
  },
  methods: {
    async addSim() {
      this.loading = true;
      this.error = null;
      this.errors = {}; // Reset errors

      // Validation
      let isValid = true;
      if (!this.simData.employeeId) {
        this.errors.employeeId = "Please fill in the Employee ID";
        isValid = false;
      }
      if (!this.simData.mobileNumber) {
        this.errors.mobileNumber = "Please fill in the Mobile Number";
        isValid = false;
      }
      if (!this.simData.operator) {
        this.errors.operator = "Please select an Operator";
        isValid = false;
      }
      if (this.simData.operator === "Others" && !this.simData.otherOperator) {
        this.errors.otherOperator = "Please specify the Other Operator";
        isValid = false;
      }
      if (!this.simData.purchaseDate) {
        this.errors.purchaseDate = "Please select a Purchase Date";
        isValid = false;
      }
      if (!this.simData.status) {
        this.errors.status = "Please select a Status";
        isValid = false;
      }

      if (!isValid) {
        this.loading = false;
        return;
      }

      try {
        const response = await axios.post(
          "api/add-sim",
          this.simData
        );
        if (response.status === 201) {
          console.log("SIM added successfully:", response.data);
          this.$router.push("/view-sim"); // Navigate to ViewSim.vue
        } else {
          console.error("Failed to add SIM:", response.data);
          this.error = "Failed to add SIM. Please try again.";
        }
      } catch (error) {
        console.error("Error adding SIM:", error);
        this.error =
          "An error occurred while adding the SIM. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    checkOperator() {
      if (this.simData.operator !== "Others") {
        this.simData.otherOperator = ""; // Reset otherOperator if operator is not 'Others'
      }
    },
  },
};
</script>

<style scoped>
.add-sim-heading {
  color: black; /* Heading color */
  text-align: center;
  margin-bottom: 20px;
  /* Shadow effect */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.add-sim-form {
  margin: auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #f4f4f4; /* Form background color */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add box shadow */
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  color: #333; /* Label text color */
}

.form-input,
.form-select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.required-field {
  color: red; /* Red asterisk color */
  margin-left: 5px;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.submit-btn {
  padding: 10px;
  background-color: #007bff; /* Submit button color */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}

.submit-btn:disabled {
  background-color: #a8a8a8;
  cursor: not-allowed;
}

.submit-btn:hover {
  background-color: #05923d; /* Submit button color on hover */
}
</style>
