<template>
  <CModal
    alignment="center"
    backdrop="static"
    :visible="modelValue"
    @close="$emit('update:modelValue', false)"
  >
    <CModalHeader>
      <CModalTitle>Thêm Giao Dịch</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm @submit.prevent="handleTransactionSubmit">
        <div class="mb-3">
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
        </div>
        <div class="mb-3">
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
        </div>
        <div class="mb-3">
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
        </div>
        <div class="mb-3">
          <CFormInput
            label="Số Tiền"
            type="number"
            v-model.number="transactionForm.amount"
            required
          />
        </div>
        <div class="mb-3">
          <CFormInput
            label="Mô Tả"
            v-model="transactionForm.description"
            required
          />
        </div>
        <div class="mb-3 d-flex">
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
import { ref, computed } from "vue";
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

const transactionForm = ref({
  type: "expense",
  accountId: store.accounts[0]?.id?.toString() || "",
  categoryId: getDefaultCategoryId("expense"),
  amount: 0,
  description: "",
  ...getCurrentDateTime(),
});

const filteredCategories = computed(() => {
  const filtered = store.categories.filter(
    (cat) => cat.type === transactionForm.value.type
  );
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

    emit("update:modelValue", false);
    transactionForm.value = {
      type: "expense",
      accountId: store.accounts[0]?.id.toString() || "",
      categoryId: getDefaultCategoryId("expense"),
      amount: 0,
      description: "",
      ...getCurrentDateTime(),
    };
  } catch (error) {
    console.error("Error in handleTransactionSubmit:", error);
    alert(error.message);
  }
};
</script>
