// import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';


export const initDatabase = async (db) => {
   // Wait for database to open
  return new Promise((resolve, reject) => {
    db.execAsync(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, phone TEXT, validTill TEXT, email TEXT, name TEXT);'
    )
      .then(() => {
        console.log('Database initialized successfully');
        resolve();
      })
      .catch((error) => {
        console.error('Error initializing database:', error);
        reject(error);
      });
  });
};


export const saveAuthData = async (phone, validTill,  name, email, db) => {
  // return false;
  try {
    // Clear previous data
    await db.runAsync('DELETE FROM users;');
 
   let res = await db.runAsync('INSERT INTO users (phone, validTill, email, name) VALUES (?, ?, ?, ?)', phone, validTill, email, name);

return true;
} catch (error) {
    console.error('Error saving users data:', error);
    throw error;
  }
};


export const getAuthData = async (db) => {
  
  try {
    const result = await db.getAllAsync('SELECT * FROM users LIMIT 1;');
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error getting users data:', error);
    throw error;
  }
};


export const clearAuthData = async (db) => {
  
  try {
    await db.execAsync('DELETE FROM users;');
    console.log('Auth data cleared successfully');
  } catch (error) {
    console.error('Error clearing users data:', error);
    throw error;
  }
};
