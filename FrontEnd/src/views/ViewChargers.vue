<template>
  <div class="view-chargers">
    <h2 class="main-heading" @mouseover="highlightHeading = true" @mouseleave="highlightHeading = false">
      View Chargers
    </h2>

    <!-- Download Button -->
    <div class="download-btn">
      <button class="icon-btn download-btn" @click="downloadChargers">
        <i class="fas fa-download"></i> Download Chargers
      </button>
    </div>

     <!-- Charger Count Display -->
     <div class="charger-count">
      Charger count: {{ total }}
    </div>


    <table class="chargers-table">
      <thead>
        <tr>
          <th class="employee-id">
            Employee ID
            <button class="filter-icon" @click="showFilter('employeeId')">
              <i class="fas fa-filter"></i>
            </button>
          </th>
          <th class="brand">
            Brand
            <button class="filter-icon" @click="showFilter('brand')">
              <i class="fas fa-filter"></i>
            </button>
          </th>
          <th class="model">
            Model
            <button class="filter-icon" @click="showFilter('model')">
              <i class="fas fa-filter"></i>
            </button>
          </th>
          <th class="type">
            Type
            <button class="filter-icon" @click="showFilter('type')">
              <i class="fas fa-filter"></i>
            </button>
          </th>
          <th class="watts">
            Watts
            <button class="filter-icon" @click="showFilter('watts')">
              <i class="fas fa-filter"></i>
            </button>
          </th>
          <th class="date-of-issue">Date of Issue</th>
          <th class="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="charger in filteredChargers" :key="charger.id">
          <td>{{ charger.employee_id }}</td>
          <td>{{ charger.brand }}</td>
          <td>{{ charger.model }}</td>
          <td>{{ charger.charger_type }}</td>
          <td>{{ charger.watts }}</td>
          <td>{{ formatDate(charger.date_of_issue) }}</td>
          <td class="actions">
            <button class="icon-btn edit-btn" @mouseover="highlightButton(charger.id, 'edit')"
              @mouseleave="resetButtonHighlight(charger.id, 'edit')" @click="editCharger(charger.id)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="icon-btn delete-btn" @mouseover="highlightButton(charger.id, 'delete')"
              @mouseleave="resetButtonHighlight(charger.id, 'delete')" @click="deleteCharger(charger.id)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button class="prev-btn" @click="prevPage" :disabled="page <= 1" @mouseover="highlightPagination('prev')"
        @mouseleave="resetPagination('prev')">
        Previous
      </button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button class="next-btn" @click="nextPage" :disabled="page >= totalPages" @mouseover="highlightPagination('next')"
        @mouseleave="resetPagination('next')">
        Next
      </button>
    </div>
    <div v-if="showFilterModal" class="filter-modal">
      <div class="filter-modal-content">
        <h3>Filter by {{ filterColumn }}</h3>
        <input type="text" v-model="filterValue" />
        <button @click="applyFilter">Apply</button>
        <button @click="clearFilter">Clear</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default {
  data() {
    return {
      chargers: [],
      page: 1,
      limit: 2000,
      total: 0,
      showFilterModal: false,
      filterColumn: "",
      filterValue: "",
      highlightHeading: false,
      filters: {
        employeeId: "",
        brand: "",
        model: "",
        type: "",
        watts: "",
      },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.limit);
    },
    filteredChargers() {
      return this.chargers.filter((charger) => {
        return (
          (!this.filters.employeeId ||
            charger.employee_id.includes(this.filters.employeeId)) &&
          (!this.filters.brand ||
            charger.brand
              .toLowerCase()
              .includes(this.filters.brand.toLowerCase())) &&
          (!this.filters.model ||
            charger.model
              .toLowerCase()
              .includes(this.filters.model.toLowerCase())) &&
          (!this.filters.type ||
            charger.charger_type
              .toLowerCase()
              .includes(this.filters.type.toLowerCase())) &&
          (!this.filters.watts ||
            charger.watts.toString().includes(this.filters.watts.toString()))
        );
      });
    },
  },
  mounted() {
    this.fetchChargers();
  },
  methods: {
    async fetchChargers() {
      try {
        const response = await axios.get(`api/chargers?page=${this.page}&limit=${this.limit}`, {
          params: {
            page: this.page,
            limit: this.limit,
            filters: this.filters, // Include filters in the request
          },
        });
        this.chargers = response.data.data;
        this.total = response.data.total;
      } catch (error) {
        console.error("Error fetching chargers:", error);
      }
    },
    deleteCharger(chargerId) {
      axios
        .delete(`api/charger/${chargerId}`)
        .then((response) => {
          if (response.data.success) {
            this.chargers = this.chargers.filter(
              (charger) => charger.id !== chargerId
            );
            this.fetchChargers(); // Refetch chargers to update the list
          }
        })
        .catch((error) => {
          console.error("Error deleting charger:", error);
        });
    },
    editCharger(id) {
      console.log(this.page)
      this.$router.push({ name: "EditChargerDetail", params: { id }, query: { page: this.page } });
    },

    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchChargers();
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchChargers();
      }
    },
    showFilter(column) {
      this.filterColumn = column;
      this.filterValue = this.filters[column];
      this.showFilterModal = true;
    },
    applyFilter() {
      this.filters[this.filterColumn] = this.filterValue;
      this.page = 1; // Reset page to 1 after applying filter
      this.fetchChargers(); // Fetch chargers with updated filter
      this.showFilterModal = false;
    },

    clearFilter() {
      this.filters[this.filterColumn] = "";
      this.filterValue = "";
      this.showFilterModal = false;
    },
    formatDate(date) {
      return format(new Date(date), "MM/dd/yyyy");
    },
    highlightButton(chargerId, type) {
      const button = document.getElementById(`${type}-btn-${chargerId}`);
      if (button) {
        button.classList.add("highlighted");
      }
    },
    resetButtonHighlight(chargerId, type) {
      const button = document.getElementById(`${type}-btn-${chargerId}`);
      if (button) {
        button.classList.remove("highlighted");
      }
    },
    highlightPagination(buttonType) {
      const button = document.querySelector(`.${buttonType}-btn`);
      if (button) {
        button.classList.add("highlighted");
      }
    },
    resetPagination(buttonType) {
      const button = document.querySelector(`.${buttonType}-btn`);
      if (button) {
        button.classList.remove("highlighted");
      }
    },
    async fetchPageData(page) {
      try {
        const response = await axios.get(
          `api/chargers?page=${page}&limit=${this.limit}`
        );
        return response.data.data;
      } catch (error) {
        console.error("Error fetching page data:", error);
        return [];
      }
    },
    async downloadChargers() {
      try {
        const allChargers = [];

        for (let i = 1; i <= this.totalPages; i++) {
          const pageData = await this.fetchPageData(i);
          allChargers.push(...pageData);
        }

        const chargerData = allChargers.map((charger) => ({
          "Employee ID": charger.employee_id,
          Brand: charger.brand,
          Model: charger.model,
          Type: charger.charger_type,
          Watts: charger.watts,
          "Date of Issue": this.formatDate(charger.date_of_issue),
        }));

        const worksheet = XLSX.utils.json_to_sheet(chargerData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Chargers");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "chargers.xlsx");
      } catch (error) {
        console.error("Error downloading chargers:", error);
      }
    },
  },
};
</script>

<style scoped>
.view-chargers {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
}

.main-heading {
  color: rgb(10, 10, 10);
  cursor: pointer;
  transition:
    color 0.3s,
    text-shadow 0.3s;
  /* Add transition for text-shadow */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  /* Initial text-shadow */
  position: relative;
  /* Ensure z-index works correctly */
}

.main-heading:before {
  content: "";
  /* Create pseudo-element for background effect */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  /* Place behind text */
  background-color: #4caf50;
  /* Adjust color as per your design */
  transform: rotateY(15deg);
  /* Adjust rotation for 3D effect */
  opacity: 0.3;
  /* Adjust opacity as per your design */
  transition:
    opacity 0.3s,
    transform 0.3s;
  /* Add transitions */
}

.main-heading:hover {
  color: #024c12;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4);
  /* Change text-shadow on hover */
}

.main-heading:hover:before {
  opacity: 0.5;
  /* Change opacity on hover */
  transform: rotateY(25deg);
  /* Change rotation on hover */
}

.chargers-table {
  width: 100%;
  border-collapse: collapse;
}

.chargers-table th,
.chargers-table td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.chargers-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  position: relative;
  /* Required for positioning filter icon */
}

.filter-icon {
  margin-left: 10px;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  position: absolute;
  /* Position relative to the th element */
  right: 10px;
  /* Adjust as needed */
}

.actions {
  display: flex;
  gap: 10px;
}

.download-btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.icon-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
  border-radius: 5px;
}

.icon-btn.edit-btn {
  color: #4caf50;
}

.icon-btn.delete-btn {
  color: #f44336;
}

.icon-btn.highlighted {
  background-color: rgba(0, 0, 0, 0.1);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination button {
  padding: 10px 20px;
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: #f4f4f4;
  border-radius: 5px;
  transition:
    background-color 0.3s,
    transform 0.3s,
    color 0.3s;
  /* Add color transition */
}

.pagination button:disabled {
  cursor: not-allowed;
  background-color: #e0e0e0;
}

.pagination button.highlighted-pagination {
  background-color: #ccc;
  color: #fff;
  /* Change color on hover */
  transform: scale(1.1);
}

.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.filter-modal-content {
  background-color: rgb(102, 110, 121);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.filter-modal-content h3 {
  margin-top: 0;
}

.filter-modal-content button {
  margin-right: 10px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.charger-count {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.filter-modal-content button:hover {
  background-color: #13aed4;
}
</style>
