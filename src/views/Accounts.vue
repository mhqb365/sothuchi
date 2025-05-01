<template>
  <div class="container-lg py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">Tài Khoản</h4>
      <CButton color="primary" @click="showModal = true">
        Thêm Tài Khoản
      </CButton>
    </div>

    <CCard v-for="account in store.accounts" :key="account.id" class="mb-3">
      <CCardBody>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-1">{{ account.name }}</h5>
            <div class="text-medium-emphasis">{{ account.description }}</div>
          </div>
          <div class="d-flex align-items-center">
            <h4 class="mb-0 me-3">{{ account.balance.toLocaleString() }}đ</h4>
            <CButton
              color="primary"
              variant="ghost"
              size="sm"
              class="me-2"
              @click="handleEdit(account)"
            >
              Sửa
            </CButton>
            <CButton
              color="danger"
              variant="ghost"
              size="sm"
              @click="handleDelete(account.id)"
            >
              Xóa
            </CButton>
          </div>
        </div>
      </CCardBody>
    </CCard>

    <!-- Add Account Modal -->
    <CModal :visible="showModal" @close="showModal = false">
      <CModalHeader>
        <CModalTitle>Thêm Tài Khoản</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm @submit.prevent="handleSubmit">
          <div class="mb-3">
            <CFormInput label="Tên Tài Khoản" v-model="form.name" required />
          </div>
          <div class="mb-3">
            <CFormInput label="Mô Tả" v-model="form.description" />
          </div>
          <div class="mb-3">
            <CFormInput
              label="Số Dư Ban Đầu"
              type="number"
              v-model.number="form.balance"
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

    <!-- Edit Account Modal -->
    <CModal :visible="showEditModal" @close="showEditModal = false">
      <CModalHeader>
        <CModalTitle>Sửa Tài Khoản</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm @submit.prevent="handleUpdate">
          <div class="mb-3">
            <CFormInput
              label="Tên Tài Khoản"
              v-model="editForm.name"
              required
            />
          </div>
          <div class="mb-3">
            <CFormInput label="Mô Tả" v-model="editForm.description" />
          </div>
          <div class="mb-3">
            <CFormInput
              label="Số Dư"
              type="number"
              v-model.number="editForm.balance"
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
  description: "",
  balance: 0,
});

const editForm = ref({
  id: null,
  name: "",
  description: "",
  balance: 0,
});

const handleSubmit = () => {
  store.addAccount({
    id: Date.now(),
    ...form.value,
  });
  showModal.value = false;
  form.value = {
    name: "",
    description: "",
    balance: 0,
  };
};

const handleEdit = (account) => {
  editForm.value = { ...account };
  showEditModal.value = true;
};

const handleUpdate = () => {
  try {
    store.updateAccount(editForm.value);
    showEditModal.value = false;
  } catch (error) {
    alert(error.message);
  }
};

const handleDelete = (id) => {
  try {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      store.deleteAccount(id);
    }
  } catch (error) {
    alert(error.message);
  }
};
</script>
