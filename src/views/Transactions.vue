<template>
  <div class="container-lg py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">Giao Dịch</h4>
      <div class="d-flex align-items-center">
        <DateRange
          class="me-2"
          @range-selected="handleDateRangeChange"
          defaultValue="thisMonth"
        />
        <CButton
          color="primary"
          class="me-2 d-none d-md-block"
          @click="showTransactionModal = true"
        >
          Thêm Giao Dịch
        </CButton>
        <CButton color="success" @click="showTransferModal = true">
          Chuyển Khoản
        </CButton>
      </div>
    </div>

    <CCard
      v-for="transaction in sortedTransactions"
      :key="transaction.id"
      class="mb-3"
    >
      <CCardBody>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-1">
              {{
                transaction.type === "transfer"
                  ? `${getAccountName(
                      transaction.fromAccount
                    )} → ${getAccountName(transaction.toAccount)}`
                  : transaction.description
              }}
            </h5>
            <div class="text-medium-emphasis">
              {{ getTransactionDateTime(transaction) }}
            </div>
          </div>
          <div class="d-flex align-items-center">
            <h5
              class="mb-0 me-3"
              :class="{
                'text-success': transaction.type === 'income',
                'text-danger': transaction.type === 'expense',
              }"
            >
              {{
                transaction.type === "income"
                  ? "+"
                  : transaction.type === "expense"
                  ? "-"
                  : ""
              }}{{ transaction.amount.toLocaleString() }}đ
            </h5>
            <CButton
              color="primary"
              variant="ghost"
              size="sm"
              class="me-2"
              @click="handleEdit(transaction)"
            >
              Sửa
            </CButton>
            <CButton
              color="danger"
              variant="ghost"
              size="sm"
              @click="handleDelete(transaction.id)"
            >
              Xóa
            </CButton>
          </div>
        </div>
      </CCardBody>
    </CCard>

    <!-- Replace Add Transaction Modal with component -->
    <CreateTransaction v-model="showTransactionModal" />

    <Transfer
      :visible="showTransferModal"
      @close="showTransferModal = false"
      @submit="showTransferModal = false"
    />

    <EditTransaction
      :visible="showEditModal"
      :transaction="selectedTransaction"
      @close="showEditModal = false"
      @submit="showEditModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "@/stores";
import DateRange from "@/components/DateRange.vue";
import CreateTransaction from "@/components/Transactions/Create.vue";
import EditTransaction from "@/components/Transactions/Edit.vue";
import Transfer from "@/components/Transactions/Transfer.vue";
import moment from "moment";

const store = useStore();
const showTransactionModal = ref(false);
const showTransferModal = ref(false);
const showEditModal = ref(false);
const selectedTransaction = ref(null);
const dateRange = ref({
  start: null,
  end: null,
});

const sortedTransactions = computed(() => {
  let filtered = [...store.transactions];

  // Apply date range filter
  if (dateRange.value.start && dateRange.value.end) {
    filtered = filtered.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate >= dateRange.value.start &&
        transactionDate <= dateRange.value.end
      );
    });
  }

  return filtered.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    return Number(b.id) - Number(a.id);
  });
});

const handleDateRangeChange = (range) => {
  dateRange.value = {
    start: range.start,
    end: range.end,
  };
};

const getAccountName = (id) => {
  return store.accounts.find((acc) => acc.id === id)?.name || "";
};

const getCategoryName = (id) => {
  return store.categories.find((cat) => cat.id === id)?.name || "";
};

const formatDateTime = (dateString) => {
  return moment(dateString).format("DD/MM/YYYY HH:mm");
};

const getTransactionDateTime = (transaction) => {
  return transaction.type === "transfer"
    ? formatDateTime(transaction.date)
    : `${getAccountName(transaction.accountId)} - ${getCategoryName(
        transaction.categoryId
      )}\n${formatDateTime(transaction.date)}`;
};

const handleEdit = (transaction) => {
  selectedTransaction.value = transaction;
  showEditModal.value = true;
};

const handleDelete = async (id) => {
  try {
    if (!confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      return;
    }

    await store.deleteTransaction(id);
  } catch (error) {
    console.error("Error in handleDelete:", error);
    alert(error.message || "Có lỗi xảy ra khi xóa giao dịch");
  }
};
</script>
