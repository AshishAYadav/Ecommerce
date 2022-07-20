const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getProducts']);
roleRights.set(roles[1], ['getProducts', 'manageProducts']);

module.exports = {
  roles,
  roleRights,
};
