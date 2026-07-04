<template>
    <div>
        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-gray-500 mt-2">Loading employees...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
            <table class="min-w-full bg-white rounded-lg shadow">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="py-3 px-4 text-left">ID</th>
                        <th class="py-3 px-4 text-left">Name</th>
                        <th class="py-3 px-4 text-left">Email</th>
                        <th class="py-3 px-4 text-left">Department</th>
                        <th class="py-3 px-4 text-left">Position</th>
                        <th class="py-3 px-4 text-left">Hire Date</th>
                        <th class="py-3 px-4 text-left">Salary</th>
                        <th class="py-3 px-4 text-left">Status</th>
                        <th class="py-3 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="emp in employees" :key="emp.id" class="border-t hover:bg-gray-50">
                        <td class="py-3 px-4">{{ emp.empl }}</td>
                        <td class="py-3 px-4">{{ emp.name }}</td>
                        <td class="py-3 px-4">{{ emp.email }}</td>
                        <td class="py-3 px-4">{{ emp.department }}</td>
                        <td class="py-3 px-4">{{ emp.position }}</td>
                        <td class="py-3 px-4">{{ emp.hireDate }}</td>
                        <td class="py-3 px-4">{{ formatSalary(emp.salary) }}</td>
                        <td class="py-3 px-4">
                            <span :class="emp.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                                  class="px-2 py-1 rounded-full text-xs font-semibold">
                                {{ emp.active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="py-3 px-4">
                            <button @click="$emit('edit', emp)" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                            <button @click="$emit('delete', emp.id)" class="text-red-600 hover:text-red-800">Delete</button>
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