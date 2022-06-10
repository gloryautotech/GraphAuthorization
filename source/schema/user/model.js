import Sequelize from 'sequelize';

const User = {
  id: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  user_name: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
  user_head_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  permission: {
    type: Sequelize.STRING(45),
    allowNull: true,
  }
};

export default User;
