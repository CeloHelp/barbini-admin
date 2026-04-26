import bcrypt from "bcryptjs";
import { AppError } from "../lib/http.js";
import { signToken } from "../middleware/auth.js";
import { userRepository } from "../repositories/userRepository.js";

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError(401, "E-mail ou senha invalidos");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new AppError(401, "E-mail ou senha invalidos");

    const sessionUser = { id: user.id, name: user.name, email: user.email };
    return { token: signToken(sessionUser), user: sessionUser };
  },
};
