<template>
  <div class="container-lg py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">Tổng Quan</h4>
      <div class="d-flex align-items-center">
        <DateRange
          ref="dateRangeRef"
          default-value="thisMonth"
          @range-selected="handleRangeSelected"
        />
      </div>
    </div>

    <div class="row g-4">
      <!-- Total Balance -->
      <div class="col-md-4">
        <CCard>
          <CCardBody>
            <h5 class="mb-2">Tổng Số Dư</h5>
            <h3 class="mb-0">{{ totalBalance.toLocaleString() }}đ</h3>
          </CCardBody>
        </CCard>
      </div>

      <!-- Monthly Income -->
      <div class="col-md-4">
        <CCard>
          <CCardBody>
            <h5 class="mb-2">Thu {{ dateRangeRef?.selectedLabel }}</h5>
            <h3 class="text-success mb-0">
              {{ monthlyIncome.toLocaleString() }}đ
            </h3>
          </CCardBody>
        </CCard>
      </div>

      <!-- Monthly Expense -->
      <div class="col-md-4">
        <CCard>
          <CCardBody>
            <h5 class="mb-2">Chi {{ dateRangeRef?.selectedLabel }}</h5>
            <h3 class="text-danger mb-0">
              {{ monthlyExpense.toLocaleString() }}đ
            </h3>
          </CCardBody>
        </CCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "@/stores";
import DateRange from "@/components/DateRange.vue";
import moment from "moment";

const store = useStore();
const dateRangeRef = ref(null);

// Add date range ref
const dateRange = ref({
  start: moment().startOf("month").toDate(), // matches default-value="thisMonth"
  end: moment().endOf("month").toDate(),
});

const totalBalance = computed(() => {
  return store.accounts.reduce((sum, acc) => sum + acc.balance, 0);
});

function handleRangeSelected(range) {
  dateRange.value = range;
}

const monthlyIncome = computed(() => {
  return store.transactions
    .filter(
      (t) =>
        t.type === "income" &&
        new Date(t.date) >= dateRange.value.start &&
        new Date(t.date) <= dateRange.value.end
    )
    .reduce((sum, t) => sum + t.amount, 0);
});

const monthlyExpense = computed(() => {
  return store.transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date) >= dateRange.value.start &&
        new Date(t.date) <= dateRange.value.end
    )
    .reduce((sum, t) => sum + t.amount, 0);
});
</script>
