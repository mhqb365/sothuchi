<template>
  <CModal
    alignment="center"
    backdrop="static"
    :visible="visible"
    @close="onClose"
  >
    <CModalHeader>
      <CModalTitle>Chuyển Khoản</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm @submit.prevent="handleSubmit">
        <div class="mb-3">
          <CFormSelect
            label="Từ Tài Khoản"
            v-model="form.fromAccount"
            :options="[
              { label: 'Chọn tài khoản', value: '' },
              ...accounts.map((acc) => ({
                label: `${acc.name} (${acc.balance.toLocaleString()}đ)`,
                value: acc.id,
              })),
            ]"
            required
          />
        </div>
        <div class="mb-3">
          <CFormSelect
            label="Đến Tài Khoản"
            v-model="form.toAccount"
            :options="[
              { label: 'Chọn tài khoản', value: '' },
              ...accounts.map((acc) => ({
                label: `${acc.name} (${acc.balance.toLocaleString()}đ)`,
                value: acc.id,
              })),
            ]"
            required
          />
        </div>
        <div class="mb-3">
          <CFormInput
            label="Số Tiền"
            type="number"
            v-model.number="form.amount"
            required
          />
        </div>
        <div class="mb-3 d-flex">
          <CFormInput
            type="date"
            v-model="form.dateInput"
            required
            class="me-2"
          />
          <CFormInput type="time" v-model="form.timeInput" required />
        </div>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="onClose">Đóng</CButton>
      <CButton color="primary" @click="handleSubmit">Chuyển</CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "@/stores";
import moment from "moment";
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CForm,
//   CFormSelect,
//   CFormInput,
// } from "@coreui/vue";

const store = useStore();
const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(["close", "submit"]);

const getCurrentDateTime = () => {
  const now = moment();
  return {
    dateInput: now.format("YYYY-MM-DD"),
    timeInput: now.format("HH:mm"),
  };
};

const form = ref({
  fromAccount: "",
  toAccount: "",
  amount: 0,
  ...getCurrentDateTime(),
});

const accounts = computed(() => store.accounts);

const onClose = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  form.value = {
    fromAccount: "",
    toAccount: "",
    amount: 0,
    ...getCurrentDateTime(),
  };
};

const handleSubmit = async () => {
  try {
    if (!form.value.fromAccount) {
      throw new Error("Vui lòng chọn tài khoản chuyển");
    }
    if (!form.value.toAccount) {
      throw new Error("Vui lòng chọn tài khoản nhận");
    }
    if (form.value.amount <= 0) {
      throw new Error("Số tiền phải lớn hơn 0");
    }

    const date = moment(
      `${form.value.dateInput} ${form.value.timeInput}`,
      "YYYY-MM-DD HH:mm"
    );

    await store.addTransaction({
      type: "transfer",
      ...form.value,
      fromAccount: form.value.fromAccount.toString(),
      toAccount: form.value.toAccount.toString(),
      amount: Number(form.value.amount),
      date: date.toISOString(),
    });

    emit("submit");
    resetForm();
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    alert(error.message);
  }
};
</script>
