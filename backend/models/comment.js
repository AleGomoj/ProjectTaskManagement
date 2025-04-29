module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Comment', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      content: { type: DataTypes.TEXT, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      taskId: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      tableName: 'comments',
      timestamps: true
    });
  };
  