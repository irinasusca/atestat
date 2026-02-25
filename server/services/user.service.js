import * as userRepo from "../db/user.repo.js";

///User management

///Admin can turn a user into a doctor
export async function makeDoctor(id_utilizator) {
    const user = await userRepo.findById(id_utilizator);
    if(!user) throw new Error("Invalid credentials");

    const updatedUser = await userRepo.updateUserRole(user.id_utilizator, "doctor");
    if(!updatedUser) throw new Error("Failed to update user role");
    return updatedUser;
}

