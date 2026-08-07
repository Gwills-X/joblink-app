"use server";

import bcrypt from "bcrypt";
import { RegisterFormScheme, LoginFormScheme } from "@/lib/rules";
import { authEngine } from "@/services/authEngine"; // 🚀 Import our new Auth Engine
import { createSession } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";

export async function register(state, formData) {
  // Support both signatures: (state, formData) and (formData)
  if (!formData && state && typeof state.get === "function") {
    formData = state;
    state = undefined;
  }
  const name = formData?.get("name");
  const email = formData?.get("email");

  const validatedFields = RegisterFormScheme.safeParse({
    email,
    name,
    password: formData?.get("password"),
    confirmPassword: formData?.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      email,
      name,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const password = validatedFields.data.password;

  try {
    // 1. Verify existence via authEngine
    const existingUser = await authEngine.getUserForLogin(email);
    if (existingUser) {
      return {
        success: false,
        email,
        name,
        errors: { email: ["Email is already registered"] },
      };
    }

    // 2. Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Register across both platforms smoothly through the engine
    const cleanUserId = await authEngine.registerUser({
      name,
      email,
      hashedPassword,
      role: "user",
    });

    // 4. Set the tracking cookie session
    await createSession(String(cleanUserId));
  } catch (error) {
    console.error("Registration Action Exception Error:", error);
    const devMsg =
      process.env.NODE_ENV !== "production"
        ? error.message
        : "Something went wrong processing authentication registers.";
    return {
      success: false,
      errors: {
        server: [devMsg],
      },
    };
  }

  redirect("/dashboard");
}

export async function login(state, formData) {
  // Support both signatures: (state, formData) and (formData)
  if (!formData && state && typeof state.get === "function") {
    formData = state;
    state = undefined;
  }

  const validatedFields = LoginFormScheme.safeParse({
    email: formData?.get("email"),
    password: formData?.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await authEngine.getUserForLogin(email);

    if (!user) {
      return { success: false, errors: { email: ["Email not found"] } };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      await createSession(String(user.id));
    } else {
      return {
        success: false,
        email,
        errors: { password: ["Incorrect password"] },
      };
    }
  } catch (error) {
    // 🚀 NEW: Cold Start / Database Timeout Handling
    if (
      error.code === "ETIMEDOUT" ||
      error.message === "DATABASE_UNAVAILABLE"
    ) {
      return {
        success: false,
        errors: {
          server: [
            "The system is waking up from sleep mode. Please wait 10 seconds and try logging in again.",
          ],
        },
      };
    }

    console.error("Login Action Exception Error:", error);
    const devMessage =
      process.env.NODE_ENV !== "production"
        ? error.message
        : "Authentication validation failure occurred.";
    return {
      success: false,
      errors: { server: [devMessage] },
    };
  }

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  redirect("/login");
}

export async function refreshSessionAction() {
  // Logic to refresh - only call this from the Client-Side SessionRefresher
  const user = await getAuthUser();
  if (user) {
    await createSession(user.userId);
  }
}

export async function updatePasswordAction(currentPassword, newPassword) {
  try {
    const user = await getAuthUser();
    if (!user) throw new Error("Unauthorized");

    const userPassword = await authEngine.getUserPassword(String(user.userId));
    const isMatch = await bcrypt.compare(currentPassword, userPassword);
    if (!isMatch) throw new Error("Current password does not match.");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authEngine.updatePassword(String(user.userId), hashedPassword);
    return { success: "Password updated successfully!" };
  } catch (error) {
    return { error: error.message };
  }
}
