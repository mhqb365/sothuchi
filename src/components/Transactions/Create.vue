<template>
  <CModal
    backdrop="static"
    :visible="modelValue"
    @close="$emit('update:modelValue', false)"
  >
    <CModalHeader>
      <CModalTitle>Thêm Giao Dịch</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm @submit.prevent="handleTransactionSubmit">
        <CRow class="mb-2">
          <CCol>
            <CFormSelect
              label="Loại"
              v-model="transactionForm.type"
              :options="[
                { label: 'Thu Nhập', value: 'income' },
                { label: 'Chi Tiêu', value: 'expense' },
              ]"
              required
              @change="handleTypeChange"
            />
          </CCol>
          <CCol>
            <CFormSelect
              label="Tài Khoản"
              v-model="transactionForm.accountId"
              :options="[
                { label: 'Chọn tài khoản', value: '' },
                ...store.accounts.map((acc) => ({
                  label: `${acc.name} (${acc.balance.toLocaleString()}đ)`,
                  value: acc.id,
                })),
              ]"
              required
            />
          </CCol>
        </CRow>

        <CRow class="mb-3">
          <CCol>
            <CFormSelect
              label="Danh Mục"
              v-model="transactionForm.categoryId"
              :options="[
                { label: 'Chọn danh mục', value: '' },
                ...filteredCategories.map((cat) => ({
                  label: cat.name,
                  value: cat.id.toString(),
                })),
              ]"
              required
            />
          </CCol>
          <CCol>
            <CFormInput
              label="Số Tiền"
              type="number"
              inputmode="numeric"
              v-model.number="transactionForm.amount"
              required
            />
          </CCol>
        </CRow>

        <CFormInput
          class="mb-3"
          label="Mô Tả"
          v-model="transactionForm.description"
          required
        />

        <div class="d-flex">
          <CFormInput
            type="date"
            v-model="transactionForm.dateInput"
            required
            class="me-2"
          />
          <CFormInput
            type="time"
            v-model="transactionForm.timeInput"
            required
          />
        </div>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="$emit('update:modelValue', false)">
        Đóng
      </CButton>
      <CButton color="primary" @click="handleTransactionSubmit"> Thêm </CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "@/stores";
import moment from "moment";

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
const store = useStore();

const getCurrentDateTime = () => {
  const now = moment();
  return {
    dateInput: now.format("YYYY-MM-DD"),
    timeInput: now.format("HH:mm"),
  };
};

const getDefaultCategoryId = (type) => {
  const defaultCategory = store.categories.find((cat) => cat.type === type);
  return defaultCategory?.id?.toString() || "";
};

const getDefaultAccountId = () => {
  // If there's a default account set in the store, use it
  if (
    store.defaultAccountId &&
    store.accounts.find(
      (acc) => acc.id.toString() === store.defaultAccountId.toString()
    )
  ) {
    return store.defaultAccountId.toString();
  }
  // Otherwise fallback to the first account
  return store.accounts[0]?.id?.toString() || "";
};

const transactionForm = ref({
  type: "expense",
  accountId: getDefaultAccountId(),
  categoryId: getDefaultCategoryId("expense"),
  amount: "",
  description: "",
  ...getCurrentDateTime(),
});

const filteredCategories = computed(() => {
  const filtered = store.categories.filter(
    (cat) => cat.type === transactionForm.value.type
  ).sort((a, b) => a.name.localeCompare(b.name));
  if (
    filtered.length > 0 &&
    !filtered.find((cat) => cat.id === transactionForm.value.categoryId)
  ) {
    transactionForm.value.categoryId = filtered[0].id.toString();
  }
  return filtered;
});

const handleTypeChange = () => {
  transactionForm.value.categoryId = getDefaultCategoryId(
    transactionForm.value.type
  );
};

// We can simplify the watch functionality to only save when explicitly changed by user
// This avoids potential issues with the initial setup
const userChangedAccount = ref(false);

watch(
  () => transactionForm.value.accountId,
  (newAccountId) => {
    if (newAccountId && userChangedAccount.value) {
      store.setDefaultAccount(newAccountId.toString());
    }
    // Reset the flag after first change
    if (!userChangedAccount.value && newAccountId) {
      userChangedAccount.value = true;
    }
  }
);

const handleTransactionSubmit = async () => {
  try {
    if (!transactionForm.value.accountId) {
      throw new Error("Vui lòng chọn tài khoản");
    }
    if (!transactionForm.value.categoryId) {
      throw new Error("Vui lòng chọn danh mục");
    }
    if (transactionForm.value.amount <= 0) {
      throw new Error("Số tiền phải lớn hơn 0");
    }

    const date = moment(
      `${transactionForm.value.dateInput} ${transactionForm.value.timeInput}`,
      "YYYY-MM-DD HH:mm"
    );

    await store.addTransaction({
      ...transactionForm.value,
      accountId: transactionForm.value.accountId.toString(),
      categoryId: transactionForm.value.categoryId.toString(),
      amount: Number(transactionForm.value.amount),
      date: date.toISOString(),
    });

    // Set the selected account as default for next transaction
    if (transactionForm.value.accountId) {
      store.setDefaultAccount(transactionForm.value.accountId.toString());
    }

    emit("update:modelValue", false);
    // Reset the transaction form with the current default account
    transactionForm.value = {
      type: "expense",
      accountId: getDefaultAccountId(), // This will get the newly set default
      categoryId: getDefaultCategoryId("expense"),
      amount: 0,
      description: "",
      ...getCurrentDateTime(),
    };

    // Reset the user change flag for the next modal opening
    userChangedAccount.value = false;
  } catch (error) {
    console.error("Error in handleTransactionSubmit:", error);
    alert(error.message);
  }
};
</script>
