<template>
    <div>
        <!-- Loading -->
        <div v-if="loading" class="loading-spinner">
            <div class="spinner"></div>
            <p class="loading-text">Loading employees...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error-banner">
            <span class="error-text">{{ error }}</span>
        </div>

        <!-- Table -->
        <div v-else class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Hire Date</th>
                        <th>Salary</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="emp in employees" :key="emp.id">
                        <td>{{ emp.empl }}</td>
                        <td>{{ emp.name }}</td>
                        <td>{{ emp.email }}</td>
                        <td>{{ emp.department }}</td>
                        <td>{{ emp.position }}</td>
                        <td>{{ emp.hireDate }}</td>
                        <td>{{ formatSalary(emp.salary) }}</td>
                        <td>
                            <span :class="emp.active ? 'badge badge-active' : 'badge badge-inactive'">
                                {{ emp.active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td>
                            <button @click="$emit('edit', emp)" class="btn btn-sm btn-primary" style="margin-right: 4px;">Edit</button>
                            <button @click="$emit('delete', emp.id)" class="btn btn-sm btn-danger">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['employees', 'loading', 'error']);
const emit = defineEmits(['edit', 'delete']);

function formatSalary(amount) {
    return new Intl.NumberFormat('ms-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
</script>