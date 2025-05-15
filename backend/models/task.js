module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Task', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT },
      status: { type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'canceled'), defaultValue: 'pending' },
      priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' },
      due_date: { type: DataTypes.DATEONLY },
      boardId: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      tableName: 'tasks',
      timestamps: true
    });
  };
  