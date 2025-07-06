<template>
  <div class="container-lg py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">Tài Khoản</h4>
      <CButton color="primary" @click="openAccountModal()">
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
            <h4
              class="mb-0 me-3"
              :class="{ 'text-danger': account.balance < 0 }"
            >
              {{ account.balance.toLocaleString() }}đ
            </h4>
            <CButton
              color="primary"
              variant="ghost"
              size="sm"
              class="me-2"
              @click="openAccountModal(account)"
            >
              Sửa
            </CButton>
            <CButton
              color="danger"
              variant="ghost"
              size="sm"
              @click="confirmDelete(account)"
            >
              Xóa
            </CButton>
          </div>
        </div>
      </CCardBody>
    </CCard>

    <!-- Account Modal (Add/Edit) -->
    <CModal
      backdrop="static"
      :visible="showAccountModal"
      @close="showAccountModal = false"
    >
      <CModalHeader>
        <CModalTitle>{{
          isEditMode ? "Sửa Tài Khoản" : "Thêm Tài Khoản"
        }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm @submit.prevent="handleAccountSubmit">
          <CFormInput
            class="mb-3"
            label="Tên Tài Khoản"
            v-model="accountForm.name"
            required
          />
          <CFormInput
            class="mb-3"
            label="Số Dư"
            type="number"
            inputmode="numeric"
            v-model.number="accountForm.balance"
            required
          />
          <CFormInput
            class="mb-3"
            label="Mô Tả"
            v-model="accountForm.description"
          />

          <CFormCheck
            id="defaultAccountCheckbox"
            v-model="isDefaultAccount"
            label="Đặt làm tài khoản mặc định"
          />
          <small class="form-text text-muted">
            Tài khoản mặc định sẽ được tự động chọn khi tạo giao dịch mới
          </small>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showAccountModal = false">
          Đóng
        </CButton>
        <CButton color="primary" @click="handleAccountSubmit">
          {{ isEditMode ? "Cập Nhật" : "Thêm" }}
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- Confirm Delete Modal -->
    <CModal
      backdrop="static"
      :visible="showConfirmModal"
      @close="showConfirmModal = false"
    >
      <CModalHeader>
        <CModalTitle>Xác Nhận Xóa</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>Bạn có chắc chắn muốn xóa tài khoản "{{ accountToDelete.name }}"?</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showConfirmModal = false">
          Hủy
        </CButton>
        <CButton color="danger" @click="handleDeleteConfirm">Xóa</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "@/stores";

const store = useStore();
const showAccountModal = ref(false);
const showConfirmModal = ref(false);
const accountToDelete = ref({ id: null, name: "" });
const isEditMode = ref(false);
const isDefaultAccount = ref(false);

const defaultAccountForm = {
  id: null,
  name: "",
  description: "",
  balance: 0,
};

const accountForm = ref({ ...defaultAccountForm });

// Open the account modal for either add or edit
const openAccountModal = (account = null) => {
  if (account) {
    // Edit mode
    accountForm.value = { ...account };
    isEditMode.value = true;
    // Check if this account is the default
    isDefaultAccount.value = store.defaultAccountId === account.id.toString();
  } else {
    // Add mode
    accountForm.value = { ...defaultAccountForm };
    isEditMode.value = false;
    isDefaultAccount.value = false;
  }
  showAccountModal.value = true;
};

// Handle both add and update
const handleAccountSubmit = () => {
  try {
    if (isEditMode.value) {
      // Update existing account
      store.updateAccount(accountForm.value);

      // Handle default account setting
      if (isDefaultAccount.value) {
        store.setDefaultAccount(accountForm.value.id.toString());
      } else if (store.defaultAccountId === accountForm.value.id.toString()) {
        // If this was the default but checkbox is unchecked, clear default
        store.setDefaultAccount("");
      }
    } else {
      // Add new account
      const newAccount = {
        id: Date.now().toString(),
        ...accountForm.value,
      };

      store.addAccount(newAccount);

      // Set as default if checkbox is checked
      if (isDefaultAccount.value) {
        store.setDefaultAccount(newAccount.id.toString());
      }
    }

    // Close modal and reset form
    showAccountModal.value = false;
    accountForm.value = { ...defaultAccountForm };
    isEditMode.value = false;
    isDefaultAccount.value = false;
  } catch (error) {
    alert(error.message);
  }
};

const confirmDelete = (account) => {
  accountToDelete.value = account;
  showConfirmModal.value = true;
};

const handleDeleteConfirm = () => {
  try {
    // Check if this account is the default account
    if (store.defaultAccountId === accountToDelete.value.id.toString()) {
      store.setDefaultAccount("");
    }

    store.deleteAccount(accountToDelete.value.id);
    showConfirmModal.value = false;
  } catch (error) {
    alert(error.message);
  }
};
</script>
