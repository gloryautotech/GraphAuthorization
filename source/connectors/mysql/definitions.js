import User from '../../schema/user/model';
import Contact from '../../schema/contact/model';

const definitions = [
  {
    name: 'user',
    model: User,
    table: 'User',
  },
  {
    name: 'contact',
    model: Contact,
    table: 'Contact',
  }
];

export default definitions;
