<template>
  <div>
    <h2 class="add-charger-heading">Add Charger</h2>
    <div class="add-charger-form">
      <div class="form-group">
        <label for="employeeId" class="form-label"
          >Employee ID: <span class="required-field">*</span></label
        >
        <input
          type="text"
          v-model="employeeId"
          placeholder="Employee ID"
          class="form-input"
        />
        <p v-if="errors.employeeId" class="error">{{ errors.employeeId }}</p>
      </div>

      <div class="form-group">
        <label for="chargerBrandSelect" class="form-label"
          >Charger Brand: <span class="required-field">*</span></label
        >
        <select
          v-model="selectedBrand"
          id="chargerBrandSelect"
          class="form-select"
        >
          <option disabled value="">Select a Charger Brand</option>
          <option v-for="brand in chargerBrands" :key="brand" :value="brand">
            {{ brand }}
          </option>
          <option value="Others">Others</option>
        </select>
        <p v-if="errors.selectedBrand" class="error">
          {{ errors.selectedBrand }}
        </p>
      </div>

      <div class="form-group" v-if="selectedBrand === 'Others'">
        <label for="otherBrand" class="form-label"
          >Specify other brand: <span class="required-field">*</span></label
        >
        <input
          type="text"
          v-model="otherBrand"
          placeholder="Specify other brand"
          class="form-input"
        />
        <p v-if="errors.otherBrand" class="error">{{ errors.otherBrand }}</p>
      </div>

      <div class="form-group">
        <label for="model" class="form-label"
          >Charger Model: <span class="required-field">*</span></label
        >
        <input
          type="text"
          v-model="model"
          placeholder="Charger Model"
          class="form-input"
        />
        <p v-if="errors.model" class="error">{{ errors.model }}</p>
      </div>

      <div class="form-group">
        <label for="chargerTypeSelect" class="form-label"
          >Charger Type: <span class="required-field">*</span></label
        >
        <select
          v-model="chargerType"
          id="chargerTypeSelect"
          class="form-select"
        >
          <option disabled value="">Select a Charger Type</option>
          <option value="dropdown">Choose from List</option>
          <option value="Others">Others</option>
        </select>
        <p v-if="errors.chargerType" class="error">{{ errors.chargerType }}</p>
      </div>

      <div v-if="chargerType === 'dropdown'" class="charger-type">
        <label class="checkbox-label" v-for="type in chargerTypes" :key="type">
          <input
            type="checkbox"
            v-model="selectedChargerTypes"
            :value="type"
            class="checkbox-input"
          />
          {{ type }}
        </label>
        <p v-if="errors.selectedChargerTypes" class="error">
          {{ errors.selectedChargerTypes }}
        </p>
      </div>

      <div class="form-group" v-if="chargerType === 'Others'">
        <label for="otherChargerType" class="form-label"
          >Specify Other Type: <span class="required-field">*</span></label
        >
        <input
          type="text"
          id="otherChargerType"
          v-model="otherChargerType"
          placeholder="Specify other type"
          class="form-input"
        />
        <p v-if="errors.otherChargerType" class="error">
          {{ errors.otherChargerType }}
        </p>
      </div>

      <div class="form-group">
        <label for="watts" class="form-label"
          >Watts: <span class="required-field">*</span></label
        >
        <input
          type="text"
          v-model="watts"
          placeholder="Watts"
          class="form-input"
        />
        <p v-if="errors.watts" class="error">{{ errors.watts }}</p>
      </div>

      <div class="form-group">
        <label for="dateOfIssue" class="form-label"
          >Date of Issue: <span class="required-field">*</span></label
        >
        <input type="date" v-model="dateOfIssue" class="form-input" />
        <p v-if="errors.dateOfIssue" class="error">{{ errors.dateOfIssue }}</p>
      </div>

      <button @click="addCharger" :disabled="loading" class="submit-btn">
        {{ loading ? "Adding..." : "Add Charger" }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      employeeId: "",
      selectedBrand: "",
      otherBrand: "",
      model: "",
      chargerType: "",
      selectedChargerTypes: [],
      otherChargerType: "",
      watts: "",
      dateOfIssue: "",
      loading: false,
      error: null,
      errors: {}, // For field-specific errors
      chargerBrands: [
        "Amazon Basics",
        "Anker",
        "Baseus",
        "Belkin",
        "Dell",
        "GooglePixel",
        "Huawei",
        "Oneplus",
        "Oppo",
        "Portronics",
        "Rager",
        "Remax",
        "Samsung",
        "Spigen",
        "Ugreen",
        "Wekome",
        "Xiaomi",
        "RKAIG",
      ],
      chargerTypes: [
        "AC",
        "PD",
        "QC",
        "PPS",
        "PD+QC",
        "VOOC",
        "SUPER VOOC",
        "Wireless",
      ],
    };
  },
  methods: {
    addCharger() {
      this.loading = true;
      this.error = null;
      this.errors = {}; // Reset errors

      // Validation
      let isValid = true;
      if (!this.employeeId) {
        this.errors.employeeId = "Please fill the Employee ID";
        isValid = false;
      }
      if (!this.selectedBrand) {
        this.errors.selectedBrand = "Please select a Charger Brand";
        isValid = false;
      }
      if (this.selectedBrand === "Others" && !this.otherBrand.trim()) {
        this.errors.otherBrand = "Please specify the other brand";
        isValid = false;
      }
      if (!this.model) {
        this.errors.model = "Please fill the Charger Model";
        isValid = false;
      }
      if (!this.chargerType) {
        this.errors.chargerType = "Please select a Charger Type";
        isValid = false;
      }
      if (
        this.chargerType === "dropdown" &&
        this.selectedChargerTypes.length === 0
      ) {
        this.errors.selectedChargerTypes =
          "Please select at least one Charger Type";
        isValid = false;
      }
      if (this.chargerType === "Others" && !this.otherChargerType.trim()) {
        this.errors.otherChargerType = "Please specify the other type";
        isValid = false;
      }
      if (!this.watts) {
        this.errors.watts = "Please fill the Watts";
        isValid = false;
      }
      if (!this.dateOfIssue) {
        this.errors.dateOfIssue = "Please fill the Date of Issue";
        isValid = false;
      }

      if (!isValid) {
        this.loading = false;
        return;
      }

      let brandToSend = this.selectedBrand;
      if (this.selectedBrand === "Others") {
        brandToSend = this.otherBrand.trim();
      }

      let chargerTypeToSend;
      if (this.chargerType === "Others") {
        chargerTypeToSend = this.otherChargerType;
      } else if (this.chargerType === "dropdown") {
        chargerTypeToSend = this.selectedChargerTypes.join(", ");
      }

      const currentDateTime = new Date().toISOString(); // Get current date and time in ISO format

      axios
        .post("api/add-charger", {
          employeeId: this.employeeId,
          brand: brandToSend,
          model: this.model,
          chargerType: chargerTypeToSend,
          watts: this.watts,
          dateOfIssue: this.dateOfIssue || currentDateTime, // Use current date and time if dateOfIssue is not set
        })
        .then((response) => {
          if (response.data.success) {
            this.employeeId = "";
            this.selectedBrand = "";
            this.otherBrand = "";
            this.model = "";
            this.chargerType = "";
            this.selectedChargerTypes = [];
            this.otherChargerType = "";
            this.watts = "";
            this.dateOfIssue = "";
            this.$router.push("/view-chargers");
          } else {
            this.error = "Failed to add charger. Please try again.";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.error =
            "An error occurred while adding the charger. Please try again.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.add-charger-heading {
  color: black; /* Heading color */
  text-align: center;
  margin-bottom: 20px;
  /* Shadow effect */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.add-charger-form {
  margin: auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #f4f4f4; /* Form background color */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add box shadow */
  /* Add shadow effect to the background */
  background-image: linear-gradient(to right, #fff, #f4f4f4, #fff);
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

.checkbox-label {
  display: block;
  margin-bottom: 5px;
}

.checkbox-input {
  margin-right: 10px;
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
