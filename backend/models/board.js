module.exports = (sequelize, DataTypes) => {
    const Board = sequelize.define('Board', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
    }, {
      tableName: 'boards',
      timestamps: true
    });
  
    return Board;
  };
