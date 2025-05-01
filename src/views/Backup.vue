<template>
  <div class="container-lg py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">Sao Lưu & Khôi Phục</h4>
    </div>

    <CCard class="mb-3">
      <CCardBody>
        <h5 class="mb-3">Xuất Dữ Liệu</h5>
        <p class="text-medium-emphasis">
          Tải xuống tất cả dữ liệu để sao lưu hoặc chuyển sang thiết bị khác
        </p>
        <CButton color="primary" @click="handleExport">Xuất Dữ Liệu</CButton>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardBody>
        <h5 class="mb-3">Nhập Dữ Liệu</h5>
        <p class="text-medium-emphasis">
          Khôi phục dữ liệu từ file đã xuất trước đó. Lưu ý: Dữ liệu hiện tại sẽ
          bị ghi đè
        </p>
        <div class="mb-3">
          <CFormInput
            type="file"
            accept=".json"
            @change="handleFileSelect"
            ref="fileInput"
          />
        </div>
        <CButton color="primary" :disabled="!selectedFile" @click="handleImport"
          >Nhập Dữ Liệu</CButton
        >
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "@/stores";
import { storageService } from "@/services/storage.service";

const store = useStore();
const selectedFile = ref(null);
const fileInput = ref(null);

const handleExport = () => {
  try {
    const data = {
      accounts: store.accounts,
      categories: store.categories,
      transactions: store.transactions,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sothuchi-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export error:", error);
    alert("Có lỗi khi xuất dữ liệu");
  }
};

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
};

const handleImport = async () => {
  try {
    if (!selectedFile.value) {
      throw new Error("Vui lòng chọn file");
    }

    if (!confirm("Dữ liệu hiện tại sẽ bị ghi đè. Bạn có chắc chắn?")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate data structure
        if (!data.accounts || !data.categories || !data.transactions) {
          throw new Error("File dữ liệu không hợp lệ");
        }

        // Import data
        storageService.setItem("accounts", data.accounts);
        storageService.setItem("categories", data.categories);
        storageService.setItem("transactions", data.transactions);

        // Reload data in store
        await store.initialize();

        alert("Nhập dữ liệu thành công");
        fileInput.value.value = ""; // Reset file input
        selectedFile.value = null;
      } catch (error) {
        console.error("Import error:", error);
        alert("File dữ liệu không hợp lệ");
      }
    };

    reader.readAsText(selectedFile.value);
  } catch (error) {
    console.error("Import error:", error);
    alert(error.message || "Có lỗi khi nhập dữ liệu");
  }
};
</script>
