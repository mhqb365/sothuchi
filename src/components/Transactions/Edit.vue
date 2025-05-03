<template>
  <CModal
    alignment="center"
    backdrop="static"
    :visible="visible"
    @close="onClose"
  >
    <CModalHeader>
      <CModalTitle>
        {{ form.type === "transfer" ? "Sửa Chuyển Khoản" : "Sửa Giao Dịch" }}
      </CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm @submit.prevent="handleSubmit">
        <template v-if="form.type !== 'transfer'">
          <div class="mb-3">
            <CFormSelect
              label="Loại"
              v-model="form.type"
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
              v-model="form.accountId"
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
              label="Danh Mục"
              v-model="form.categoryId"
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
            <CFormInput label="Mô Tả" v-model="form.description" required />
          </div>
        </template>
        <template v-else>
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
        </template>
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
      <CButton color="primary" @click="handleSubmit">Cập Nhật</CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "@/stores";
import moment from "moment";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormSelect,
  CFormInput,
} from "@coreui/vue";

const props = defineProps({
  visible: Boolean,
  transaction: Object,
});

const emit = defineEmits(["close", "submit"]);
const store = useStore();

const form = ref({
  id: "",
  type: "expense",
  accountId: "",
  categoryId: "",
  fromAccount: "",
  toAccount: "",
  amount: 0,
  description: "",
  dateInput: "",
  timeInput: "",
});

watch(
  () => props.transaction,
  (newTransaction) => {
    if (newTransaction) {
      const datetime = moment(newTransaction.date);
      form.value = {
        id: newTransaction.id,
        type: newTransaction.type,
        accountId: newTransaction.accountId,
        categoryId: newTransaction.categoryId,
        fromAccount: newTransaction.fromAccount,
        toAccount: newTransaction.toAccount,
        amount: newTransaction.amount,
        description: newTransaction.description,
        dateInput: datetime.format("YYYY-MM-DD"),
        timeInput: datetime.format("HH:mm"),
      };
    }
  },
  { immediate: true }
);

const accounts = computed(() => store.accounts);

const filteredCategories = computed(() => {
  return store.categories.filter((cat) => cat.type === form.value.type);
});

const handleTypeChange = () => {
  const defaultCategory = store.categories.find(
    (cat) => cat.type === form.value.type
  );
  form.value.categoryId = defaultCategory?.id?.toString() || "";
};

const onClose = () => {
  emit("close");
  form.value = {
    id: "",
    type: "expense",
    accountId: "",
    categoryId: "",
    fromAccount: "",
    toAccount: "",
    amount: 0,
    description: "",
    dateInput: "",
    timeInput: "",
  };
};

const handleSubmit = async () => {
  try {
    const date = moment(
      `${form.value.dateInput} ${form.value.timeInput}`,
      "YYYY-MM-DD HH:mm"
    );

    await store.updateTransaction({
      ...form.value,
      date: date.toISOString(),
    });

    emit("submit");
    onClose();
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    alert(error.message);
  }
};
</script>
