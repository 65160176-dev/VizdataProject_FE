<template>
    <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 p-3">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title">{{ isEditMode ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่' }}</h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>

                <div class="modal-body pt-3">
                    <form @submit.prevent="submitForm" class="theme-form">
                        <div class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label text-muted mb-1">ชื่อ-นามสกุล (Name) <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" v-model="form.name"
                                    :class="{ 'is-invalid': errors.name }">
                                <div class="invalid-feedback">{{ errors.name }}</div>
                            </div>

                            <div class="col-md-12">
                                <label class="form-label text-muted mb-1">เบอร์โทรศัพท์ (Phone) <span
                                        class="text-danger">*</span></label>
                                <input type="tel" class="form-control" v-model="form.phone"
                                    :class="{ 'is-invalid': errors.phone }" placeholder="08xxxxxxxx">
                                <div class="invalid-feedback">{{ errors.phone }}</div>
                            </div>

                            <div class="col-12">
                                <label class="form-label text-muted mb-1">ที่อยู่ (Address) <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" v-model="form.address"
                                    :class="{ 'is-invalid': errors.address }" placeholder="บ้านเลขที่ หมู่ ซอย ถนน">
                                <div class="invalid-feedback">{{ errors.address }}</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label text-muted mb-1">จังหวัด (Province) <span
                                        class="text-danger">*</span></label>
                                <SearchSelect v-model="form.province" :options="provinceList" placeholder="เลือกจังหวัด"
                                    :error="!!errors.province" @change="onProvinceChange(false)" />
                                <div v-if="errors.province" class="text-danger small mt-1">{{ errors.province }}</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label text-muted mb-1">อำเภอ/เขต (District) <span
                                        class="text-danger">*</span></label>
                                <SearchSelect v-model="form.district" :options="districtList"
                                    placeholder="เลือกอำเภอ/เขต" :disabled="!form.province" :error="!!errors.district"
                                    @change="onDistrictChange(false)" />
                                <div v-if="errors.district" class="text-danger small mt-1">{{ errors.district }}</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label text-muted mb-1">ตำบล/แขวง (Sub-district) <span
                                        class="text-danger">*</span></label>
                                <SearchSelect v-model="form.subDistrict" :options="subDistrictList"
                                    placeholder="เลือกตำบล/แขวง" :disabled="!form.district"
                                    :error="!!errors.subDistrict" @change="onSubDistrictChange" />
                                <div v-if="errors.subDistrict" class="text-danger small mt-1">{{ errors.subDistrict }}
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label text-muted mb-1">รหัสไปรษณีย์ (Zip Code) <span
                                        class="text-danger">*</span></label>
                                <select class="form-select" v-model="form.zipCode"
                                    :class="{ 'is-invalid': errors.zipCode }" :disabled="!form.subDistrict">
                                    <option value="" disabled>เลือกรหัสไปรษณีย์</option>
                                    <option v-for="z in zipCodeList" :key="z" :value="z">{{ z }}</option>
                                </select>
                                <div class="invalid-feedback">{{ errors.zipCode }}</div>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer border-0 pt-0 justify-content-end gap-2">
                    <button type="button" class="btn btn-outline-secondary" @click="closeModal">
                        ยกเลิก
                    </button>
                    <button type="button" class="btn btn-solid bg-primary text-white" @click="submitForm">
                        {{ isEditMode ? 'อัปเดต' : 'บันทึก' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
// ✅ Import Component SearchSelect (ตรวจสอบ path ให้ถูกต้อง)
import SearchSelect from '~/components/searchSelect.vue'

const props = defineProps({
    show: Boolean,
    editData: Object
})

const emit = defineEmits(['close', 'save'])
const isEditMode = ref(false)

// Data สำหรับที่อยู่
const thaiAddressData = ref([])
const provinceList = ref([])
const districtList = ref([])
const subDistrictList = ref([])
const zipCodeList = ref([]) // ✅ เพิ่ม list zipCode

const form = reactive({
    _id: null,
    name: '',
    phone: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    zipCode: '',
    isDefault: false
})

const errors = reactive({
    name: '', phone: '', address: '', subDistrict: '', district: '', province: '', zipCode: ''
})

// โหลดข้อมูลที่อยู่ไทยเมื่อ Component ถูกสร้าง
onMounted(async () => {
    try {
        const response = await fetch('https://raw.githubusercontent.com/earthchie/jquery.Thailand.js/master/jquery.Thailand.js/database/raw_database/raw_database.json');
        const data = await response.json();
        thaiAddressData.value = data;

        // Init Province List
        const provinces = data.map(i => i.province);
        provinceList.value = [...new Set(provinces)].sort();
    } catch (error) {
        console.error('Failed to load address data:', error);
    }
})

watch(() => props.show, (newVal) => {
    if (newVal) {
        // Clear errors
        Object.keys(errors).forEach(key => errors[key] = '');

        if (props.editData) {
            isEditMode.value = true;
            Object.assign(form, props.editData);

            // ✅ Trigger เพื่อโหลด Dropdown ให้ตรงกับข้อมูลที่แก้ไข
            if (thaiAddressData.value.length > 0) {
                updateDropdownsFromEdit();
            } else {
                // Retry เล็กน้อยเผื่อข้อมูลยังไม่มา
                setTimeout(() => updateDropdownsFromEdit(), 500);
            }

        } else {
            isEditMode.value = false;
            resetForm();
        }
    }
})

const updateDropdownsFromEdit = () => {
    onProvinceChange(true);
    onDistrictChange(true);
    onSubDistrictChange(); // Load Zipcode list
}

const resetForm = () => {
    form._id = null
    form.name = ''
    form.phone = ''
    form.address = ''
    form.subDistrict = ''
    form.district = ''
    form.province = ''
    form.zipCode = ''
    form.isDefault = false
    districtList.value = []
    subDistrictList.value = []
    zipCodeList.value = []
}

// --- Address Logic ---
const onProvinceChange = (preserveChildren = false) => {
    if (!preserveChildren) {
        form.district = '';
        form.subDistrict = '';
        form.zipCode = '';
        zipCodeList.value = [];
    }

    if (!form.province) return;

    const districts = thaiAddressData.value
        .filter(i => i.province === form.province)
        .map(i => i.amphoe);

    districtList.value = [...new Set(districts)].sort();
}

const onDistrictChange = (preserveChildren = false) => {
    if (!preserveChildren) {
        form.subDistrict = '';
        form.zipCode = '';
        zipCodeList.value = [];
    }

    if (!form.district) return;

    const subDistricts = thaiAddressData.value
        .filter(i => i.province === form.province && i.amphoe === form.district)
        .map(i => i.district);

    subDistrictList.value = [...new Set(subDistricts)].sort();
}

// ✅ Logic ใหม่สำหรับ Zip Code Dropdown
const onSubDistrictChange = () => {
    if (!form.subDistrict) {
        zipCodeList.value = [];
        form.zipCode = '';
        return;
    }

    // หา Matches ทั้งหมดในตำบลนั้น
    const matches = thaiAddressData.value.filter(i =>
        i.province === form.province &&
        i.amphoe === form.district &&
        i.district === form.subDistrict
    );

    // ดึง Zip Code ที่ไม่ซ้ำกันออกมา
    const codes = [...new Set(matches.map(i => String(i.zipcode)))];
    zipCodeList.value = codes;

    // ถ้ามีอันเดียว เลือกเลย
    if (codes.length === 1) {
        form.zipCode = codes[0];
    } else {
        // ถ้าเป็นการแก้ไขและค่าเดิมยังอยู่ใน list ก็คงค่าเดิมไว้ ถ้าไม่อยู่ก็ล้างออก
        if (!codes.includes(form.zipCode)) {
            form.zipCode = ''; // ให้ผู้ใช้เลือกเองถ้ามีหลายอัน
        }
    }
}

// --- Validate & Submit ---
const validateForm = () => {
    let isValid = true;
    Object.keys(errors).forEach(key => errors[key] = '');

    if (!form.name) { errors.name = 'กรุณากรอกชื่อ'; isValid = false; }
    if (!form.phone) {
        errors.phone = 'กรุณากรอกเบอร์โทรศัพท์'; isValid = false;
    } else if (!/^0\d{9}$/.test(form.phone.replace(/[^0-9]/g, ''))) {
        errors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง'; isValid = false;
    }
    if (!form.address) { errors.address = 'กรุณากรอกที่อยู่'; isValid = false; }
    if (!form.province) { errors.province = 'กรุณาเลือกจังหวัด'; isValid = false; }
    if (!form.district) { errors.district = 'กรุณาเลือกอำเภอ'; isValid = false; }
    if (!form.subDistrict) { errors.subDistrict = 'กรุณาเลือกตำบล'; isValid = false; }
    if (!form.zipCode) { errors.zipCode = 'กรุณาเลือกรหัสไปรษณีย์'; isValid = false; }

    return isValid;
}

const closeModal = () => emit('close')

const submitForm = () => {
    if (validateForm()) {
        emit('save', { ...form })
    }
}
</script>

<style scoped>
/* เลือกปุ่มทุกอันใน Footer */
.modal-footer .btn {
    min-width: 130px !important;
    height: 42px !important;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-width: 1px !important;
    border-style: solid !important;
}

.btn-solid {
    border-color: #0d6efd !important;
}

/* Style for validation */
.is-invalid {
    border-color: #dc3545 !important;
    background-image: none !important;
    /* ลบ icon กากบาทของ bootstrap ออกถ้าไม่ชอบ */
}

.invalid-feedback {
    display: block;
    font-size: 0.875em;
    color: #dc3545;
}
</style>