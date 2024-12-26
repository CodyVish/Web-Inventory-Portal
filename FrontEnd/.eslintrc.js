module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-recommended", // Adjust based on your Vue version
    "eslint:recommended",
    "prettier", // Use 'prettier' instead of 'prettier/vue'
  ],
  rules: {
    "vue/multi-word-component-names": "error", // Ensure this rule is set appropriately
    // Add other rules as needed
  },
};
