import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const salts = 10; 
  const hashedPassword = await bcrypt.hash(password, salts);
  return hashedPassword;
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};