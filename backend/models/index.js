const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user')(sequelize, Sequelize);
const Board = require('./board')(sequelize, Sequelize);
const Task = require('./task')(sequelize, Sequelize);
const Tag = require('./tag')(sequelize, Sequelize);
const Category = require('./category')(sequelize, Sequelize);
const Comment = require('./comment')(sequelize, Sequelize);
const Attachment = require('./attachment')(sequelize, Sequelize);
const ActivityLog = require('./activityLog')(sequelize, Sequelize);

// Relaciones
User.hasMany(Board, { foreignKey: 'userId' });
Board.belongsTo(User, { foreignKey: 'userId' });

Board.hasMany(Task, { foreignKey: 'boardId' });
Task.belongsTo(Board, { foreignKey: 'boardId' });

Task.belongsToMany(Tag, { through: 'task_tags', foreignKey: 'taskId' });
Tag.belongsToMany(Task, { through: 'task_tags', foreignKey: 'tagId' });

// Relación board_users para miembros de boards
Board.belongsToMany(User, { through: 'board_users', as: 'users', foreignKey: 'boardId', otherKey: 'userId' });
User.belongsToMany(Board, { through: 'board_users', as: 'boards', foreignKey: 'userId', otherKey: 'boardId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Task.hasMany(Comment, { foreignKey: 'taskId' });

Task.hasMany(Attachment, { foreignKey: 'taskId' });
Attachment.belongsTo(Task, { foreignKey: 'taskId' });

Task.hasMany(ActivityLog, { foreignKey: 'taskId' });
User.hasMany(ActivityLog, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Board,
  Task,
  Tag,
  Category,
  Comment,
  Attachment,
  ActivityLog
};
