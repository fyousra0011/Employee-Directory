<template>
    <div class="flex flex-wrap gap-3 items-center mb-4">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
            <input v-model="searchQuery" @input="$emit('search', searchQuery)"
                   type="text" placeholder="Search by name, ID, or email..."
                   class="w-full border rounded-md px-4 py-2" />
        </div>

        <!-- Sort -->
        <div>
            <select v-model="sortBy" @change="$emit('sort', { sortBy, sortOrder })"
                    class="border rounded-md px-3 py-2">
                <option value="name">Name</option>
                <option value="hireDate">Hire Date</option>
                <option value="salary">Salary</option>
                <option value="department">Department</option>
            </select>
        </div>
        <div>
            <select v-model="sortOrder" @change="$emit('sort', { sortBy, sortOrder })"
                    class="border rounded-md px-3 py-2">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>

        <!-- Count -->
        <div class="text-sm text-gray-600 ml-auto">
            Total: <span class="font-semibold">{{ total }}</span> employees
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