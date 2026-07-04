<template>
    <div>
        <h3 class="card-title">{{ isEdit ? 'Edit Employee' : 'Add Employee' }}</h3>

        <!-- Error banner -->
        <div v-if="submitError" class="error-banner">
            <span class="error-text">{{ submitError }}</span>
        </div>

        <form @submit.prevent="submitForm">
            <div class="form-grid">
                <!-- Employee ID -->
                <div class="form-group">
                    <label>Employee ID</label>
                    <input v-model="form.empl" type="text" placeholder="EMP001" required />
                    <p v-if="errors.empl" class="error-text">{{ errors.empl }}</p>
                </div>

                <!-- Name -->
                <div class="form-group">
                    <label>Full Name</label>
                    <input v-model.trim="form.name" type="text" placeholder="Ahmad Bin Abdullah" required />
                    <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
                </div>

                <!-- Email -->
                <div class="form-group">
                    <label>Email</label>
                    <input v-model.trim="form.email" type="email" placeholder="ahmad@company.com" required />
                    <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
                </div>

                <!-- Department (dropdown) -->
                <div class="form-group">
                    <label>Department</label>
                    <select v-model="form.department" required>
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                    </select>
                    <p v-if="errors.department" class="error-text">{{ errors.department }}</p>
                </div>

                <!-- Position -->
                <div class="form-group">
                    <label>Position</label>
                    <input v-model.trim="form.position" type="text" placeholder="Software Engineer" required />
                    <p v-if="errors.position" class="error-text">{{ errors.position }}</p>
                </div>

                <!-- Hire Date -->
                <div class="form-group">
                    <label>Hire Date</label>
                    <input v-model="form.hireDate" type="date" required />
                    <p v-if="errors.hireDate" class="error-text">{{ errors.hireDate }}</p>
                </div>

                <!-- Salary -->
                <div class="form-group">
                    <label>Salary (RM)</label>
                    <input v-model.number="form.salary" type="number" placeholder="5000" required />
                    <p v-if="errors.salary" class="error-text">{{ errors.salary }}</p>
                </div>

                <!-- Active -->
                <div class="form-group" style="justify-content: flex-end;">
                    <label style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                        <input v-model="form.active" type="checkbox" style="width: 16px; height: 16px;" />
                        Active Employee
                    </label>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
                    {{ isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Add Employee') }}
                </button>
                <button type="button" @click="resetForm" class="btn btn-secondary">
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