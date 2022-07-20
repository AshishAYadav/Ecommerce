const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], []);
roleRights.set(roles[1], ['getNotifications', 'manageNotifications']);

module.exports = {
  roles,
  roleRights,
};
