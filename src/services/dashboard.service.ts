import { userRepository } from '@/repositories/user.repository.js';
import { expenseRepository } from '@/repositories/expense.repository.js';

const CATEGORY_PERCENTAGES = {
  ESSENTIALS: 0.5,
  LEISURE: 0.3,
  INVESTMENT: 0.2,
} as const;

async function getSummary(userId: string) {
  const user = await userRepository.findUserById(userId);
  const userExpenses = await expenseRepository.getAllExpensesByUserId(userId);

  if (!user) throw new Error('Usuário não encontrado');

  const income = Number(user.income);

  const spentByCategory = userExpenses.reduce(
    (totals, expense) => {
      totals[expense.category] += Number(expense.amount);
      return totals;
    },
    { ESSENTIALS: 0, LEISURE: 0, INVESTMENT: 0 },
  );

  return {
    income,
    breakdown: {
      ESSENTIALS: {
        limit: income * CATEGORY_PERCENTAGES.ESSENTIALS,
        spent: spentByCategory.ESSENTIALS,
      },
      LEISURE: {
        limit: income * CATEGORY_PERCENTAGES.LEISURE,
        spent: spentByCategory.LEISURE,
      },
      INVESTMENT: {
        limit: income * CATEGORY_PERCENTAGES.INVESTMENT,
        spent: spentByCategory.INVESTMENT,
      },
    },
  };
}

export const dashboardService = {
  getSummary,
};
