import { reactive } from "vue";
import { storageService } from "@/services/storage.service";

const store = reactive({
  accounts: [],
  categories: [],
  transactions: [],

  async initialize() {
    this.accounts = storageService.getItem("accounts", []);
    this.categories = storageService.getItem("categories", []);
    this.transactions = storageService.getItem("transactions", []);
  },

  // Account methods
  addAccount(account) {
    account.id = Date.now().toString();
    this.accounts.push(account);
    storageService.setItem("accounts", this.accounts);
  },

  updateAccount(account) {
    const index = this.accounts.findIndex((a) => a.id === account.id);
    if (index !== -1) {
      this.accounts[index] = { ...account };
      storageService.setItem("accounts", this.accounts);
    } else {
      throw new Error("Tài khoản không tồn tại");
    }
  },

  deleteAccount(id) {
    const hasTransactions = this.transactions.some(
      (t) => t.accountId === id || t.fromAccount === id || t.toAccount === id
    );
    if (hasTransactions) {
      throw new Error("Không thể xóa tài khoản đã có giao dịch");
    }

    const index = this.accounts.findIndex((a) => a.id === id);
    if (index !== -1) {
      this.accounts.splice(index, 1);
      storageService.setItem("accounts", this.accounts);
    }
  },

  // Category methods
  addCategory(category) {
    category.id = Date.now().toString();
    this.categories.push(category);
    storageService.setItem("categories", this.categories);
  },

  updateCategory(category) {
    const index = this.categories.findIndex((c) => c.id === category.id);
    if (index !== -1) {
      this.categories[index] = { ...category };
      storageService.setItem("categories", this.categories);
    } else {
      throw new Error("Danh mục không tồn tại");
    }
  },

  deleteCategory(id) {
    const hasTransactions = this.transactions.some((t) => t.categoryId === id);
    if (hasTransactions) {
      throw new Error("Không thể xóa danh mục đã có giao dịch");
    }

    const index = this.categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.categories.splice(index, 1);
      storageService.setItem("categories", this.categories);
    }
  },

  // Transaction methods
  addTransaction(transaction) {
    transaction.id = Date.now().toString();

    // Handle balance updates
    if (transaction.type === "transfer") {
      const fromAccount = this.accounts.find(
        (a) => a.id === transaction.fromAccount
      );
      const toAccount = this.accounts.find(
        (a) => a.id === transaction.toAccount
      );

      if (!fromAccount || !toAccount) {
        throw new Error("Tài khoản không tồn tại");
      }
      if (fromAccount.balance < transaction.amount) {
        throw new Error("Số dư không đủ để chuyển khoản");
      }

      fromAccount.balance -= transaction.amount;
      toAccount.balance += transaction.amount;
      storageService.setItem("accounts", this.accounts);
    } else {
      const account = this.accounts.find((a) => a.id === transaction.accountId);
      if (!account) {
        throw new Error("Tài khoản không tồn tại");
      }

      if (transaction.type === "expense") {
        if (account.balance < transaction.amount) {
          throw new Error("Số dư không đủ để chi tiêu");
        }
        account.balance -= transaction.amount;
      } else {
        account.balance += transaction.amount;
      }
      storageService.setItem("accounts", this.accounts);
    }

    this.transactions.push(transaction);
    storageService.setItem("transactions", this.transactions);
  },

  updateTransaction(transaction) {
    const oldTransaction = this.transactions.find(
      (t) => t.id === transaction.id
    );
    if (!oldTransaction) {
      throw new Error("Giao dịch không tồn tại");
    }

    // Revert old transaction's effect on balances
    if (oldTransaction.type === "transfer") {
      const oldFromAccount = this.accounts.find(
        (a) => a.id === oldTransaction.fromAccount
      );
      const oldToAccount = this.accounts.find(
        (a) => a.id === oldTransaction.toAccount
      );
      oldFromAccount.balance += oldTransaction.amount;
      oldToAccount.balance -= oldTransaction.amount;
    } else {
      const oldAccount = this.accounts.find(
        (a) => a.id === oldTransaction.accountId
      );
      if (oldTransaction.type === "expense") {
        oldAccount.balance += oldTransaction.amount;
      } else {
        oldAccount.balance -= oldTransaction.amount;
      }
    }

    // Apply new transaction's effect on balances
    if (transaction.type === "transfer") {
      const fromAccount = this.accounts.find(
        (a) => a.id === transaction.fromAccount
      );
      const toAccount = this.accounts.find(
        (a) => a.id === transaction.toAccount
      );

      if (!fromAccount || !toAccount) {
        throw new Error("Tài khoản không tồn tại");
      }
      if (fromAccount.balance < transaction.amount) {
        throw new Error("Số dư không đủ để chuyển khoản");
      }

      fromAccount.balance -= transaction.amount;
      toAccount.balance += transaction.amount;
    } else {
      const account = this.accounts.find((a) => a.id === transaction.accountId);
      if (!account) {
        throw new Error("Tài khoản không tồn tại");
      }

      if (transaction.type === "expense") {
        if (account.balance < transaction.amount) {
          throw new Error("Số dư không đủ để chi tiêu");
        }
        account.balance -= transaction.amount;
      } else {
        account.balance += transaction.amount;
      }
    }

    // Update transaction and save everything
    const index = this.transactions.findIndex((t) => t.id === transaction.id);
    this.transactions[index] = transaction;
    storageService.setItem("transactions", this.transactions);
    storageService.setItem("accounts", this.accounts);
  },

  deleteTransaction(id) {
    const transaction = this.transactions.find((t) => t.id === id);
    if (!transaction) {
      throw new Error("Giao dịch không tồn tại");
    }

    // Revert transaction's effect on balances
    if (transaction.type === "transfer") {
      const fromAccount = this.accounts.find(
        (a) => a.id === transaction.fromAccount
      );
      const toAccount = this.accounts.find(
        (a) => a.id === transaction.toAccount
      );
      fromAccount.balance += transaction.amount;
      toAccount.balance -= transaction.amount;
    } else {
      const account = this.accounts.find((a) => a.id === transaction.accountId);
      if (transaction.type === "expense") {
        account.balance += transaction.amount;
      } else {
        account.balance -= transaction.amount;
      }
    }

    // Remove transaction and save everything
    const index = this.transactions.findIndex((t) => t.id === id);
    this.transactions.splice(index, 1);
    storageService.setItem("transactions", this.transactions);
    storageService.setItem("accounts", this.accounts);
  },
});

export const useStore = () => store;
