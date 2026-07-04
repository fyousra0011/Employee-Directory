<template>
    <div class="app-container">
        <div class="app-inner">
            <div class="app-header">
                <h1>👥 Employee Directory</h1>
                <p>Manage employee records with full CRUD operations</p>
            </div>

            <!-- Form -->
            <div class="card">
                <EmployeeForm :initialData="editData" :isEdit="!!editData"
                              @save="handleSave" @cancel="editData = null" />
            </div>

            <!-- Controls -->
            <SearchSortControls :total="employees.length"
                                @search="handleSearch" @sort="handleSort" />

            <!-- List -->
            <div class="card">
                <EmployeeList :employees="filteredEmployees" :loading="loading" :error="error"
                              @edit="handleEdit" @delete="handleDelete" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from './services/axios';
import EmployeeList from './components/Employeelist.vue';
import EmployeeForm from './components/EmployeeForm.vue';
import SearchSortControls from './components/SearchsortControls.vue';

const employees = ref([]);
const loading = ref(false);
const error = ref(null);
const editData = ref(null);

// Search & Sort state
const searchQuery = ref('');
const sortBy = ref('name');
const sortOrder = ref('asc');

// Computed: filtered & sorted employees
const filteredEmployees = computed(() => {
    let result = [...employees.value];

    // Search
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(e =>
            e.name.toLowerCase().includes(q) ||
            e.empl.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q)
        );
    }

    // Sort (client-side for now, but we also have server-side)
    if (sortBy.value) {
        result.sort((a, b) => {
            let valA = a[sortBy.value];
            let valB = b[sortBy.value];
            if (sortBy.value === 'salary' || sortBy.value === 'hireDate') {
                valA = new Date(valA);
                valB = new Date(valB);
            }
            if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return result;
});

// ========== API Methods ==========
async function fetchEmployees(q = '', sort = 'name', order = 'asc') {
    loading.value = true;
    error.value = null;
    try {
        const params = {};
        if (q) params.q = q;
        if (sort) { params.sortBy = sort; params.order = order; }
        const response = await api.get('/employees', { params });
        employees.value = response.data;
    } catch (err) {
        error.value = err.userMessage || 'Failed to load employees';
    } finally {
        loading.value = false;
    }
}

async function handleSave(employeeData) {
    try {
        if (editData.value) {
            // Update
            await api.put(`/employees/${editData.value.id}`, employeeData);
        } else {
            // Create
            await api.post('/employees', employeeData);
        }
        editData.value = null;
        await fetchEmployees(searchQuery.value, sortBy.value, sortOrder.value);
    } catch (err) {
        throw err;
    }
}

function handleEdit(employee) {
    editData.value = { ...employee };
}

async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
        await api.delete(`/employees/${id}`);
        await fetchEmployees(searchQuery.value, sortBy.value, sortOrder.value);
    } catch (err) {
        error.value = err.userMessage || 'Failed to delete employee';
    }
}

function handleSearch(q) {
    searchQuery.value = q;
    fetchEmployees(q, sortBy.value, sortOrder.value);
}

function handleSort({ sortBy: s, sortOrder: o }) {
    sortBy.value = s;
    sortOrder.value = o;
    fetchEmployees(searchQuery.value, s, o);
}

onMounted(() => {
    fetchEmployees();
});
</script>