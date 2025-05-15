module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Attachment', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      url: { type: DataTypes.STRING(500), allowNull: false },
      taskId: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      tableName: 'attachments',
      timestamps: true
    });
  };
  