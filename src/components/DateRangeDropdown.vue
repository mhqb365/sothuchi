<template>
  <CDropdown>
    <CDropdownToggle color="primary">
      {{ selectedLabel }}
    </CDropdownToggle>
    <CDropdownMenu>
      <CDropdownItem
        class="cursor"
        v-for="option in dateOptions"
        :key="option.value"
        @click="selectRange(option)"
      >
        {{ option.label }}
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import moment from "moment";

const props = defineProps({
  defaultValue: {
    type: String,
    default: "thisMonth", // 'today', 'thisWeek', 'thisMonth', 'thisQuarter', 'thisYear'
  },
});

const dateOptions = [
  {
    label: "Hôm nay",
    value: "today",
    getRange: () => ({
      start: moment().startOf("day"),
      end: moment().endOf("day"),
    }),
  },
  {
    label: "Tuần này",
    value: "thisWeek",
    getRange: () => ({
      start: moment().startOf("week"),
      end: moment().endOf("week"),
    }),
  },
  {
    label: "Tháng này",
    value: "thisMonth",
    getRange: () => ({
      start: moment().startOf("month"),
      end: moment().endOf("month"),
    }),
  },
  {
    label: "Quý này",
    value: "thisQuarter",
    getRange: () => ({
      start: moment().startOf("quarter"),
      end: moment().endOf("quarter"),
    }),
  },
  {
    label: "Năm nay",
    value: "thisYear",
    getRange: () => ({
      start: moment().startOf("year"),
      end: moment().endOf("year"),
    }),
  },
];

const selectedOption = ref(dateOptions[0]);

onMounted(() => {
  const defaultOption = dateOptions.find(
    (opt) => opt.value === props.defaultValue
  );
  if (defaultOption) {
    selectRange(defaultOption);
  }
});

const selectedLabel = computed(() => selectedOption.value.label);

// Expose selectedLabel to parent
defineExpose({ selectedLabel });

const emit = defineEmits(["range-selected"]);

function selectRange(option) {
  selectedOption.value = option;
  const range = option.getRange();
  emit("range-selected", {
    start: range.start.toDate(),
    end: range.end.toDate(),
    rangeType: option.value,
  });
}
</script>
