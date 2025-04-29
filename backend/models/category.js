module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Category', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      color: { type: DataTypes.STRING(7), defaultValue: '#FFFFFF' }
    }, {
      tableName: 'categories',
      timestamps: true
    });
  };
  