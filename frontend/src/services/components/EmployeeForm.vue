<template>
    <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit Employee' : 'Add Employee' }}</h3>

        <!-- Error banner -->
        <div v-if="submitError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ submitError }}
        </div>

        <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Employee ID -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Employee ID</label>
                    <input v-model="form.empl" type="text" class="mt-1 block w-full border rounded-md px-3 py-2"
                           placeholder="EMP001" required />
                    <p v-if="errors.empl" class="text-red-600 text-sm mt-1">{{ errors.empl }}</p>
                </div>

                <!-- Name -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input v-model.trim="form.name" type="text" class="mt-1 block w-full border rounded-md px-3 py-2"
                           placeholder="Ahmad Bin Abdullah" required />
                    <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
                </div>

                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input v-model.trim="form.email" type="email" class="mt-1 block w-full border rounded-md px-3 py-2"
                           placeholder="ahmad@company.com" required />
                    <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
                </div>

                <!-- Department (dropdown) -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Department</label>
                    <select v-model="form.department" class="mt-1 block w-full border rounded-md px-3 py-2" required>
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                    </select>
                    <p v-if="errors.department" class="text-red-600 text-sm mt-1">{{ errors.department }}</p>
                </div>

                <!-- Position -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Position</label>
                    <input v-model.trim="form.position" type="text" class="mt-1 block w-full border rounded-md px-3 py-2"
                           placeholder="Software Engineer" required />
                    <p v-if="errors.position" class="text-red-600 text-sm mt-1">{{ errors.position }}</p>
                </div>

                <!-- Hire Date -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Hire Date</label>
                    <input v-model="form.hireDate" type="date" class="mt-1 block w-full border rounded-md px-3 py-2" required />
                    <p v-if="errors.hireDate" class="text-red-600 text-sm mt-1">{{ errors.hireDate }}</p>
                </div>

                <!-- Salary -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Salary (RM)</label>
                    <input v-model.number="form.salary" type="number" class="mt-1 block w-full border rounded-md px-3 py-2"
                           placeholder="5000" required />
                    <p v-if="errors.salary" class="text-red-600 text-sm mt-1">{{ errors.salary }}</p>
                </div>

                <!-- Active -->
                <div class="flex items-center mt-6">
                    <input v-model="form.active" type="checkbox" class="h-4 w-4 text-blue-600" />
                    <label class="ml-2 block text-sm text-gray-700">Active Employee</label>
                </div>
            </div>

            <div class="mt-4 flex gap-2">
                <button type="submit" :disabled="isSubmitting"
                        class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                    {{ isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Add Employee') }}
                </button>
                <button type="button" @click="resetForm"
                        class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400">
                    Cancel
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['initialData', 'isEdit']);
const emit = defineEmits(['save', 'cancel']);

const form = ref({
    empl: '',
    name: '',
    email: '',
    department: '',
    position: '',
    hireDate: '',
    salary: null,
    active: true
});

const errors = ref({});
const isSubmitting = ref(false);
const submitError = ref(null);

// Validation rules
const validate = () => {
    const err = {};

    if (!form.value.empl) err.empl = 'Employee ID is required';
    else if (!/^EMP[0-9]{3,5}$/.test(form.value.empl)) {
        err.empl = 'Must be EMP followed by 3-5 digits (e.g. EMP001)';
    }

    if (!form.value.name || form.value.name.length < 3) {
        err.name = 'Name must be at least 3 characters';
    }

    if (!form.value.email) err.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        err.email = 'Invalid email format';
    }

    if (!form.value.department) err.department = 'Department is required';
    if (!form.value.position) err.position = 'Position is required';

    if (!form.value.hireDate) err.hireDate = 'Hire date is required';
    else if (new Date(form.value.hireDate) > new Date()) {
        err.hireDate = 'Hire date cannot be in the future';
    }

    if (!form.value.salary && form.value.salary !== 0) err.salary = 'Salary is required';
    else if (form.value.salary < 1500) err.salary = 'Salary must be at least RM 1,500';
    else if (form.value.salary > 50000) err.salary = 'Salary cannot exceed RM 50,000';

    errors.value = err;
    return Object.keys(err).length === 0;
};

// Submit
async function submitForm() {
    submitError.value = null;
    if (!validate()) return;

    isSubmitting.value = true;
    try {
        await emit('save', { ...form.value });
        resetForm();
    } catch (err) {
        submitError.value = err.userMessage || 'Failed to save employee';
    } finally {
        isSubmitting.value = false;
    }
}

function resetForm() {
    form.value = {
        empl: '',
        name: '',
        email: '',
        department: '',
        position: '',
        hireDate: '',
        salary: null,
        active: true
    };
    errors.value = {};
    submitError.value = null;
    emit('cancel');
}

// Watch for initial data to populate form
watch(() => props.initialData, (newVal) => {
    if (newVal) {
        form.value = { ...newVal };
    }
}, { immediate: true });
</script>