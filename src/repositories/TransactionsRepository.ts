import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balanceIncome = this.totalBalance("income");
    const balanceOutcome = this.totalBalance("outcome");
    const balanceTotal = this.currentBalance();

    const transactionsBalance: Balance = {
      income: balanceIncome,
      outcome: balanceOutcome,
      total: balanceTotal,
    }

    return transactionsBalance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const currentBalance = this.currentBalance();
    const enoughFundsInBalance = currentBalance - value > 0 ? true : false;

    if (type === "outcome" && !enoughFundsInBalance) {
      throw new Error(`Not enough funds to withdraw ${value}`);
    }

    const transaction = new Transaction({title, value, type});

    this.transactions.push(transaction);

    return transaction;
  }

  private currentBalance(): number {
    return this.totalBalance("income") - this.totalBalance("outcome");
  }

  private totalBalance(type: "income" | "outcome"): number {
    const transactionsOfType = this.transactions.filter(transaction => transaction.type === type);
    if (transactionsOfType.length < 1) {
      return 0;
    }

    const transactionsValues = transactionsOfType.map(transaction => transaction.value);
    const transactionsSum = transactionsValues.reduce((sum, transactionValue) => sum + transactionValue);

    return transactionsSum;
  }
}

export default TransactionsRepository;
