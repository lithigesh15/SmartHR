const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async findByUsername(username) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.log(error);
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  static async authenticate(username, password) {
    try {
      const user = await this.findByUsername(username);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return { success: false, message: 'Invalid password' };
      }
      
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name
        }
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }
}

module.exports = User;