<template>
  <div class="money-keyboard p-2 border-top mt-2">
    <div class="text-end fw-bold mb-3 fs-4">{{ formattedInput }}đ</div>
    <div class="key-grid">
      <button
        v-for="key in keys"
        :key="key"
        class="btn btn-light rounded"
        @click="handleKeyPress(key)"
      >
        {{ key }}
      </button>
      <button class="btn btn-warning rounded" @click="deleteLast">←</button>
      <button class="btn btn-success rounded" @click="emitInput">OK</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["submit"]);

const rawInput = ref("");
const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];

const handleKeyPress = (key) => {
  if (key === "." && rawInput.value.includes(".")) return;
  if (key === "0" && rawInput.value === "") return;
  rawInput.value += key;
};

const deleteLast = () => {
  rawInput.value = rawInput.value.slice(0, -1);
};

const emitInput = () => {
  emit("submit", parseFloat(rawInput.value || "0"));
  rawInput.value = "";
};

const formattedInput = computed(() => {
  if (!rawInput.value) return "0";
  const parts = rawInput.value.split(".");
  parts[0] = parseInt(parts[0] || 0).toLocaleString();
  return parts.join(".");
});
</script>

<style scoped>
.money-keyboard {
  width: 100%;
  background: #f8f9fa;
  user-select: none;
}

.key-grid {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(3, 1fr);
}

button {
  height: 48px;
  font-size: 18px;
  padding: 6px;
  touch-action: manipulation;
}
</style>
