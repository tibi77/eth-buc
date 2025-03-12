module.exports = {
  async up(db, client) {
    const defaultUser = {
      email: 'example12@example.com',
      password: '$2b$10$w/h8IF4JurekTSYhXuh46uHg2PVeGy26.XU96.tUifVz0XFCuNgIG',
      roles: [],
      status: 'inactive',
    };
    await db.collection('users').insertMany([defaultUser]);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
