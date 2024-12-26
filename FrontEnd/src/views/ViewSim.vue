<template>
  <div class="view-sim">
    <h2 class="main-heading" @mouseover="highlightHeading = true" @mouseleave="highlightHeading = false">
      View SIM Cards
    </h2>

    <!-- Download Button -->
    <div class="download-btn">
      <button class="icon-btn download-btn" @click="downloadAllSIMs">
        <i class="fas fa-download"></i> Download sims
      </button>
    </div>

    <div class="sim-count">
      Sim count: {{ total }}
    </div>

    <!-- SIM Cards Table -->
    <table class="sim-cards-table">
      <thead>
        <tr>
          <th class="employee-id">
            Employee ID
            <button class="filter-icon" @click="showFilter('employeeId')">
              <i class="fas fa-filter"></i>
            </button>
          </th>
          <th class="mobile-number">
            Mobile Number
            <button class="filter-icon" @click="showFilter('mobileNumber')">
              <i class="fas fa-filter"></i>
            </button>
          </th>
          <th class="operator">
            Operator
            <button class="filter-icon" @click="showFilter('operator')">
              <i class="fas fa-filter"></i>
            </button>
          </th>
          <th class="status">
            Status
            <button class="filter-icon" @click="showFilter('status')">
              <i class="fas fa-filter"></i>
            </button>
          </th>
          <th class="purchase-date">Purchase Date</th>
          <th class="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sim in paginatedSIMs" :key="sim.id">
          <td>{{ sim.employee_id }}</td>
          <td>{{ sim.mobile_number }}</td>
          <td>{{ sim.operator }}</td>
          <td>{{ removeQuotes(sim.status) }}</td>
          <td>{{ formatDate(sim.purchase_date) }}</td>
          <td class="actions">
            <button class="icon-btn edit-btn" @mouseover="highlightButton(sim.id, 'edit')"
              @mouseleave="resetButtonHighlight(sim.id, 'edit')" @click="editSIM(sim)">
              <i class="fas fa-edit"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
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

    <!-- Filter Modal -->
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
      sims: [],
      allSims: [], // Store all SIMs data
      page: 1,
      limit: 2000,
      total: 0,
      showFilterModal: false,
      filterColumn: "",
      filterValue: "",
      highlightHeading: false,
      filters: {
        employeeId: "",
        mobileNumber: "",
        operator: "",
        status: "",
      },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.limit);
    },
    paginatedSIMs() {
      const start = (this.page - 1) * this.limit;
      const end = this.page * this.limit;
      return this.filteredSIMs.slice(start, end);
    },
    filteredSIMs() {
      return this.allSims.filter((sim) => {
        return (
          (!this.filters.employeeId ||
            sim.employee_id.includes(this.filters.employeeId)) &&
          (!this.filters.mobileNumber ||
            sim.mobile_number
              .toLowerCase()
              .includes(this.filters.mobileNumber.toLowerCase())) &&
          (!this.filters.operator ||
            sim.operator
              .toLowerCase()
              .includes(this.filters.operator.toLowerCase())) &&
          (!this.filters.status ||
            sim.status
              .toLowerCase()
              .includes(this.filters.status.toLowerCase()))
        );
      });
    },
  },
  mounted() {
    this.fetchSIMs();
  },
  methods: {
    async fetchSIMs() {
      try {
        const response = await axios.get(
          `/api/sims?page=${this.page}&limit=${this.limit}`
        );
        this.sims = response.data.data;
        this.total = response.data.total;
        this.allSims = await this.fetchAllSIMs();
      } catch (error) {
        console.error("Error fetching SIMs:", error);
      }
    },
    async fetchAllSIMs() {
      const totalPagesToFetch = this.totalPages;
      const allSIMs = [];

      for (let i = 1; i <= totalPagesToFetch; i++) {
        const response = await axios.get(`/api/sims?page=${i}&limit=${this.limit}`);
        allSIMs.push(...response.data.data);
      }

      return allSIMs;
    },
    downloadAllSIMs() {
      const simData = this.allSims.map((sim) => ({
        "Employee ID": sim.employee_id,
        "Mobile Number": sim.mobile_number,
        Operator: sim.operator,
        Status: this.removeQuotes(sim.status),
        "Purchase Date": this.formatDate(sim.purchase_date),
      }));

      const worksheet = XLSX.utils.json_to_sheet(simData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "SIMs");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "sims.xlsx");
    },
    editSIM(sim) {
      // Save the current page before navigating to the edit page
      const currentPage = this.page;

      // Navigate to edit page
      this.$router.push({ name: "EditSimDetail", params: { id: sim.id } })
        .then(() => {
          // Fetch SIMs again to update the data after edit
          return this.fetchSIMs();
        })
        .then(() => {
          if (currentPage <= this.totalPages) {
            this.page = currentPage; // Restore the current page after fetching updated data
          } else {
            this.page = 1;
          }
        })
        .catch((error) => {
          console.error("Error navigating to edit SIM:", error);
        });
    },
    removeQuotes(status) {
      return status.replace(/"/g, "");
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchSIMs();
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchSIMs();
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
      this.showFilterModal = false;
    },
    clearFilter() {
      this.filters[this.filterColumn] = "";
      this.filterValue = "";
      this.showFilterModal = false;
    },
    formatDate(date) {
      if (!date) return ""; // Handle case where date is null or undefined

      try {
        // Parse the date to ensure it's a valid date object
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date");
        }

        return format(parsedDate, "MM/dd/yyyy");
      } catch (error) {
        console.error("Error formatting date:", error);
        return ""; // Return empty string or handle error as needed
      }
    },
    highlightButton(simId, type) {
      const button = document.getElementById(`${type}-btn-${simId}`);
      if (button) {
        button.classList.add("highlighted");
      }
    },
    resetButtonHighlight(simId, type) {
      const button = document.getElementById(`${type}-btn-${simId}`);
      if (button) {
        button.classList.remove("highlighted");
      }
    },
    highlightPagination(buttonType) {
      const button = document.querySelector(`.${buttonType}-btn`);
      if (button) {
        button.classList.add("highlighted-pagination");
      }
    },
    resetPagination(buttonType) {
      const button = document.querySelector(`.${buttonType}-btn`);
      if (button) {
        button.classList.remove("highlighted-pagination");
      }
    },
  },
};
</script>

<style scoped>
.download-btn .big-download-btn {
  font-size: 20px;
  /* Increase font size */
  padding: 12px 20px;
  /* Increase padding */
}

.view-sim {
  padding: 20px;
}

.main-heading {
  font-size: 24px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s;
}

.main-heading:hover {
  color: #9b6218;
}

.sim-cards-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.sim-cards-table th,
.sim-cards-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.sim-cards-table th {
  background-color: #f5f5f5;
}

.sim-cards-table tr:hover {
  background-color: #f5f5f5;
}

.actions .icon-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  color: #555;
  transition: color 0.3s;
}

.actions .icon-btn:hover {
  color: #333;
}

.actions .icon-btn.highlighted {
  color: #0d6efd;
}

.filter-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  margin-left: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  border: none;
  background-color: #0d6efd;
  color: white;
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination .highlighted-pagination {
  background-color: #0d6efd;
}

.pagination span {
  margin: 0 10px;
}

.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
}

.download-btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.sim-count {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.icon-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
  border-radius: 5px;
}
</style>
