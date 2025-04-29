module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Tag', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true }
    }, {
      tableName: 'tags',
      timestamps: true
    });
  };
  