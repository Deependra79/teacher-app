import {
  getStudentByEmail,
  getTeacherByEmail,
  getStudentByAuthOrEmail,
  getTeacherByAuthOrEmail,
  updateStudentAuthId,
  updateTeacherAuthId
} from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    let authData = null;
    let authError = null;
    let authUserId = null;

    async function findSupabaseUserByEmail(emailToFind) {
      let page = 1;

      while (true) {
        const { data, error } = await supabase.auth.admin.listUsers({
          page,
          perPage: 100,
        });

        if (error) {
          throw error;
        }

        const users = Array.isArray(data)
          ? data
          : data?.users ?? [];

        if (!users.length) {
          break;
        }

        const foundUser = users.find(
          (user) =>
            user?.email?.toLowerCase() === emailToFind.toLowerCase()
        );

        if (foundUser) {
          return foundUser;
        }

        if (users.length < 100) {
          break;
        }

        page += 1;
      }

      return null;
    }

    try {
      const authRes = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authData = authRes.data;
      authError = authRes.error;
    } catch (e) {
      authError = e;
    }

    if (!authError && authData?.session) {
      authUserId = authData.user?.id;
    }

    let user = null;
    let role = null;

    if (!authUserId) {
      // Try legacy local login and migrate the account into Supabase
      const students = await getStudentByEmail(email);
      const teachers = await getTeacherByEmail(email);
      const dbUser = students[0] || teachers[0];
      const dbRole = students.length > 0 ? 'student' : teachers.length > 0 ? 'teacher' : null;

      if (!dbUser || !dbRole) {
        return Response.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const bcrypt = await import('bcryptjs');
      const isMatch = await bcrypt.compare(password, dbUser.password);
      if (!isMatch) {
        return Response.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const existingSupabaseUser = await findSupabaseUserByEmail(email);

      if (existingSupabaseUser) {
        authUserId = existingSupabaseUser.id;
        if (dbRole === 'student') {
          await updateStudentAuthId(email, authUserId);
        } else {
          await updateTeacherAuthId(email, authUserId);
        }
      } else {
        // Create Supabase auth user for legacy account
        const { data: createUserData, error: createUserError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

        if (createUserError || !createUserData?.user) {
          console.error('Legacy migration createUser error:', createUserError);
          return Response.json(
            { error: "Unable to migrate legacy account" },
            { status: 500 }
          );
        }

        authUserId = createUserData.user.id;
        if (dbRole === 'student') {
          await updateStudentAuthId(email, authUserId);
        } else {
          await updateTeacherAuthId(email, authUserId);
        }

        // Sign in again with Supabase to get a session
        const secondAuthRes = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        authData = secondAuthRes.data;
        authError = secondAuthRes.error;
        if (authError || !authData?.session) {
          return Response.json(
            { error: "Invalid email or password" },
            { status: 401 }
          );
        }
      }
    }

    const authUserIdFinal = authData?.user?.id;
    if (!authUserIdFinal) {
      return Response.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    // 🔍 Check students by auth_id first, then email as fallback
    const students = await getStudentByAuthOrEmail(authUserIdFinal, email);

    if (students.length > 0) {
      user = students[0];
      role = "student";

      if (!user.auth_id) {
        await updateStudentAuthId(email, authUserIdFinal);
        user.auth_id = authUserIdFinal;
      }
    } else {
      const teachers = await getTeacherByAuthOrEmail(authUserIdFinal, email);

      if (teachers.length > 0) {
        user = teachers[0];
        role = "teacher";

        if (!user.auth_id) {
          await updateTeacherAuthId(email, authUserIdFinal);
          user.auth_id = authUserIdFinal;
        }
      }
    }

    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    delete user.password;

    return Response.json({
      message: "Login successful",
      role,
      user,
      session: authData.session,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}