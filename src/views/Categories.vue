<template>
  <div class="container-lg py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">Danh Mục</h4>
      <CButton color="primary" @click="showModal = true">Thêm Danh Mục</CButton>
    </div>

    <CCard v-for="category in store.categories" :key="category.id" class="mb-3">
      <CCardBody>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-1">{{ category.name }}</h5>
            <div class="text-medium-emphasis">
              {{ category.type === "income" ? "Thu Nhập" : "Chi Tiêu" }}
            </div>
          </div>
          <div class="d-flex align-items-center">
            <CButton
              color="primary"
              variant="ghost"
              size="sm"
              class="me-2"
              @click="handleEdit(category)"
            >
              Sửa
            </CButton>
            <CButton
              color="danger"
              variant="ghost"
              size="sm"
              @click="handleDelete(category.id)"
            >
              Xóa
            </CButton>
          </div>
        </div>
      </CCardBody>
    </CCard>

    <!-- Add Category Modal -->
    <CModal :visible="showModal" @close="showModal = false">
      <CModalHeader>
        <CModalTitle>Thêm Danh Mục</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm @submit.prevent="handleSubmit">
          <div class="mb-3">
            <CFormInput label="Tên Danh Mục" v-model="form.name" required />
          </div>
          <div class="mb-3">
            <CFormSelect
              label="Loại"
              v-model="form.type"
              :options="[
                { label: 'Thu Nhập', value: 'income' },
                { label: 'Chi Tiêu', value: 'expense' },
              ]"
              required
            />
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">Đóng</CButton>
        <CButton color="primary" @click="handleSubmit">Thêm</CButton>
      </CModalFooter>
    </CModal>

    <!-- Edit Category Modal -->
    <CModal :visible="showEditModal" @close="showEditModal = false">
      <CModalHeader>
        <CModalTitle>Sửa Danh Mục</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm @submit.prevent="handleUpdate">
          <div class="mb-3">
            <CFormInput label="Tên Danh Mục" v-model="editForm.name" required />
          </div>
          <div class="mb-3">
            <CFormSelect
              label="Loại"
              v-model="editForm.type"
              :options="[
                { label: 'Thu Nhập', value: 'income' },
                { label: 'Chi Tiêu', value: 'expense' },
              ]"
              required
            />
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showEditModal = false">Đóng</CButton>
        <CButton color="primary" @click="handleUpdate">Cập Nhật</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "@/stores";

const store = useStore();
const showModal = ref(false);
const showEditModal = ref(false);

const form = ref({
  name: "",
  type: "expense",
});

const editForm = ref({
  id: "",
  name: "",
  type: "expense",
});

const handleSubmit = () => {
  store.addCategory({
    id: Date.now().toString(), // Convert to string
    ...form.value,
  });
  showModal.value = false;
  form.value = {
    name: "",
    type: "expense",
  };
};

const handleEdit = (category) => {
  editForm.value = { ...category };
  showEditModal.value = true;
};

const handleUpdate = () => {
  try {
    store.updateCategory(editForm.value);
    showEditModal.value = false;
  } catch (error) {
    alert(error.message);
  }
};

const handleDelete = (id) => {
  try {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      store.deleteCategory(id);
    }
  } catch (error) {
    alert(error.message);
  }
};
</script>
