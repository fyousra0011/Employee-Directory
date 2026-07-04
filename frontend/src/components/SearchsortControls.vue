<template>
    <div class="controls">
        <!-- Search -->
        <div class="search-box">
            <input v-model="searchQuery" @input="$emit('search', searchQuery)"
                   type="text" placeholder="Search by name, ID, or email..." />
        </div>

        <!-- Sort -->
        <div>
            <select v-model="sortBy" @change="$emit('sort', { sortBy, sortOrder })">
                <option value="name">Name</option>
                <option value="hireDate">Hire Date</option>
                <option value="salary">Salary</option>
                <option value="department">Department</option>
            </select>
        </div>
        <div>
            <select v-model="sortOrder" @change="$emit('sort', { sortBy, sortOrder })">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>

        <!-- Count -->
        <div class="count">
            Total: <strong>{{ total }}</strong> employees
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const sortBy = ref('name');
const sortOrder = ref('asc');

defineProps(['total']);
defineEmits(['search', 'sort']);
</script>