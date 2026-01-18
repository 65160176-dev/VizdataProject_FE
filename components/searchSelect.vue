<template>
    <div class="search-select-container" v-click-outside="closeDropdown">
        <div class="form-control d-flex justify-content-between align-items-center"
            :class="{ 'disabled': disabled, 'is-invalid': error }" @click="toggleDropdown"
            style="cursor: pointer; background-color: #fff;">
            <span :class="{ 'text-muted': !modelValue }">
                {{ modelValue || placeholder || 'เลือกรายการ' }}
            </span>
            <i class="fa fa-chevron-down text-muted" style="font-size: 10px;"></i>
        </div>

        <div v-if="isOpen" class="custom-dropdown-menu shadow-sm border rounded">
            <div class="p-2 border-bottom bg-light sticky-top">
                <input ref="searchInput" type="text" class="form-control form-control-sm"
                    placeholder="พิมพ์เพื่อค้นหา..." v-model="searchQuery">
            </div>

            <ul class="list-unstyled mb-0 custom-scrollbar">
                <li v-for="option in filteredOptions" :key="option" class="dropdown-item py-2 px-3"
                    :class="{ 'active': option === modelValue }" @click="selectOption(option)">
                    {{ option }}
                </li>
                <li v-if="filteredOptions.length === 0" class="text-center text-muted py-2 small">
                    ไม่พบข้อมูล
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'

const props = defineProps({
    modelValue: String,
    options: { type: Array, default: () => [] },
    placeholder: String,
    disabled: Boolean,
    error: Boolean
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

// กรองข้อมูลตามคำค้นหา
const filteredOptions = computed(() => {
    if (!searchQuery.value) return props.options
    return props.options.filter(opt =>
        opt.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const toggleDropdown = async () => {
    if (props.disabled) return
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        searchQuery.value = '' // เคลียร์คำค้นหาเมื่อเปิดใหม่
        await nextTick()
        searchInput.value?.focus() // โฟกัสช่องค้นหาทันที
    }
}

const closeDropdown = () => {
    isOpen.value = false
}

const selectOption = (option) => {
    emit('update:modelValue', option)
    emit('change', option)
    closeDropdown()
}

// Directive สำหรับคลิกข้างนอกแล้วปิด (v-click-outside implementation)
const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event)
            }
        }
        document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
    }
}
</script>

<style scoped>
.search-select-container {
    position: relative;
}

.disabled {
    background-color: #e9ecef !important;
    opacity: 1;
    pointer-events: none;
}

.custom-dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 1000;
    background: white;
    max-height: 250px;
    /* ความสูงสูงสุดของ Dropdown */
    overflow: hidden;
    margin-top: 4px;
}

.custom-scrollbar {
    max-height: 200px;
    overflow-y: auto;
}

.dropdown-item {
    cursor: pointer;
    font-size: 14px;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
    color: #ff5722;
    /* สีธีมของคุณ */
}

.dropdown-item.active {
    background-color: #ff5722;
    color: white;
}

.sticky-top {
    position: sticky;
    top: 0;
    z-index: 10;
}
</style>