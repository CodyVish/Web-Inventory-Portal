<template>
  <div>
    <h2 class="edit-charger-heading">Edit Charger Detail</h2>

    <!-- Loading Indicator and Error Message -->
    <div v-if="loading" class="loading-indicator">
      Loading charger details...
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- Edit Form -->
    <form @submit.prevent="updateCharger" class="edit-form">
      <label for="brand" class="form-label">Brand:</label>
      <input type="text" id="brand" v-model="editedCharger.brand" required class="form-input" />

      <label for="model" class="form-label">Model:</label>
      <input type="text" id="model" v-model="editedCharger.model" required class="form-input" />

      <label for="chargerType" class="form-label">Charger Type:</label>
      <select id="chargerType" v-model="editedCharger.chargerType" required class="form-select">
        <option disabled value="">Select a Charger Type</option>
        <option value="AC">AC</option>
        <option value="PD">PD</option>
        <option value="QC">QC</option>
        <option value="PPS">PPS</option>
        <option value="PD+QC">PD+QC</option>
        <option value="GAN">GAN</option>
        <option value="VOOC">VOOC</option>
        <option value="SUPER VOOC">SUPER VOOC</option>
        <option value="Wireless">Wireless</option>
        <option value="Others">Others</option>
      </select>

      <div v-if="editedCharger.chargerType === 'Others'" class="form-group">
        <label for="otherChargerType" class="form-label">Other Charger Type:</label>
        <input type="text" id="otherChargerType" v-model="editedCharger.otherChargerType" required class="form-input" />
      </div>

      <label for="watts" class="form-label">Watts:</label>
      <input type="number" id="watts" v-model="editedCharger.watts" required class="form-input" />

      <label for="dateOfIssue" class="form-label">Date of Issue:</label>
      <input type="date" id="dateOfIssue" v-model="editedCharger.dateOfIssue" required class="form-input" />

      <button type="submit" class="submit-btn">Update Charger</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditChargerDetail",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editedCharger: {
        id: null,
        brand: "",
        model: "",
        chargerType: "",
        otherChargerType: "",
        watts: null,
        dateOfIssue: "",
      },
      loading: false,
      error: "",
    };
  },
  mounted() {
    this.fetchChargerDetail();
  },
  methods: {
    fetchChargerDetail() {
      this.loading = true;
      axios
        .get(`api/charger/${this.id}`)
        .then((response) => {
          const chargerData = response.data.data;
          this.editedCharger = {
            id: chargerData.id,
            brand: chargerData.brand,
            model: chargerData.model,
            chargerType: chargerData.chargerType || "",
            otherChargerType: chargerData.otherChargerType || "",
            watts: chargerData.watts,
            dateOfIssue: chargerData.dateOfIssue
              ? new Date(chargerData.dateOfIssue).toISOString().substr(0, 10)
              : "",
          };
          this.loading = false;
          this.error = "";
        })
        .catch((error) => {
          this.error = "Error fetching charger details.";
          this.loading = false;
          console.error("Error fetching charger details:", error);
        });
    },
    updateCharger() {
      axios
        .put(`api/charger/${this.id}`, this.editedCharger)
        .then((response) => {
          console.log("Charger updated successfully:", response.data.message);
          console.log(this.$route.query.page)
          const page = this.$route.query.page; //|| 1; // Default to page 1 if query param is not present
          this.$router.push({ name: "ViewChargers", query: { page } });
        })
        .catch((error) => {
          this.error = "Error updating charger.";
          console.error("Error updating charger:", error);
        });
    },

  },
};
</script>

<style scoped>
.edit-charger-heading {
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

.form-group {
  margin-top: 10px;
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
