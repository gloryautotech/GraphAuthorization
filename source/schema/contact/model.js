import Sequelize from 'sequelize';

const Contact = {
  id: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
  created_by: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: {
        tableName: 'User',
      },
      key: 'id'
    }
  }
};

export default Contact;
