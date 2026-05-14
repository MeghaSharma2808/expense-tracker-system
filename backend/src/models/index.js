import User from './User.js';
import Transaction from './Transaction.js';
import Budget from './Budget.js';

// Define associations
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Budget, { foreignKey: 'userId' });
Budget.belongsTo(User, { foreignKey: 'userId' });

export { User, Transaction, Budget };
