/**
 * Calculate balances for each user in a group
 * Returns: { userId: netBalance }
 * Positive balance = person is owed money
 * Negative balance = person owes money
 */
const calculateBalances = (expenses) => {
    const balances = {};
  
    expenses.forEach(expense => {
      const paidById = expense.paidBy._id.toString();
      const sharePerPerson = expense.amount / expense.participants.length;
  
      // Person who paid gets credited
      balances[paidById] = (balances[paidById] || 0) + expense.amount;
  
      // Each participant gets debited their share
      expense.participants.forEach(participant => {
        const participantId = participant._id.toString();
        balances[participantId] = (balances[participantId] || 0) - sharePerPerson;
      });
    });
  
    return balances;
  };
  
  /**
   * Optimize settlements using greedy algorithm
   * Returns array of { from: userId, to: userId, amount: number }
   */
  const optimizeSettlements = (balances) => {
    // Separate creditors (positive balance) and debtors (negative balance)
    const creditors = [];
    const debtors = [];
  
    Object.entries(balances).forEach(([userId, balance]) => {
      if (balance > 0.01) {
        creditors.push({ userId, amount: balance });
      } else if (balance < -0.01) {
        debtors.push({ userId, amount: -balance });
      }
    });
  
    const settlements = [];
    let i = 0, j = 0;
  
    // Greedy algorithm: match largest debtor with largest creditor
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
  
      const settleAmount = Math.min(debtor.amount, creditor.amount);
  
      settlements.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: Math.round(settleAmount * 100) / 100
      });
  
      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;
  
      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }
  
    return settlements;
  };
  
  module.exports = {
    calculateBalances,
    optimizeSettlements
  };