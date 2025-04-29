module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ActivityLog', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      taskId: { type: DataTypes.INTEGER, allowNull: false },
      action: { type: DataTypes.STRING(255), allowNull: false }
    }, {
      tableName: 'activity_log',
      timestamps: true
    });
  };
  