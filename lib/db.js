import { createSupabaseServerClient } from "./supabase";

export async function getStudentByEmail(email) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("email", email);
  if (error) throw error;
  return data || [];
}

export async function getTeacherByEmail(email) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("email", email);
  if (error) throw error;
  return data || [];
}

export async function getStudentByAuthOrEmail(authId, email) {
  // Since there is no auth_id column on Supabase, query by email
  return getStudentByEmail(email);
}

export async function getTeacherByAuthOrEmail(authId, email) {
  // Since there is no auth_id column on Supabase, query by email
  return getTeacherByEmail(email);
}

export async function updateStudentAuthId(email, authId) {
  // auth_id column does not exist on Supabase, stub this function
  return [];
}

export async function updateTeacherAuthId(email, authId) {
  // auth_id column does not exist on Supabase, stub this function
  return [];
}

export async function insertStudent(data) {
  const supabase = createSupabaseServerClient();
  const { data: inserted, error } = await supabase
    .from("students")
    .insert(data)
    .select();
  if (error) throw error;
  return inserted || [];
}

export async function insertTeacher(data) {
  const supabase = createSupabaseServerClient();
  const { data: inserted, error } = await supabase
    .from("teachers")
    .insert(data)
    .select();
  if (error) throw error;
  return inserted || [];
}

export async function searchTeachers(subject, latitude, longitude, radiusKm) {
  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("teachers")
    .select("*")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (subject && subject !== "%") {
    // Subject filter
    const cleanSubject = subject.replace(/%/g, "");
    if (cleanSubject) {
      query = query.ilike("subject", `%${cleanSubject}%`);
    }
  }

  const { data: teachers, error } = await query;
  if (error) throw error;

  const radius = Number(radiusKm) || 10;
  const lat1 = Number(latitude);
  const lon1 = Number(longitude);

  const calculated = (teachers || []).map((t) => {
    const lat2 = Number(t.latitude);
    const lon2 = Number(t.longitude);

    // Haversine formula
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return { ...t, distance };
  });

  const filtered = calculated.filter((t) => t.distance <= radius);
  filtered.sort((a, b) => a.distance - b.distance);

  return filtered;
}

export async function getChatList(userId) {
  const supabase = createSupabaseServerClient();
  const idNum = Number(userId);
  const { data: messages, error } = await supabase
    .from("messages")
    .select("sender_id, receiver_id")
    .or(`sender_id.eq.${idNum},receiver_id.eq.${idNum}`);
  if (error) throw error;

  const uniquePartners = Array.from(
    new Set(
      (messages || []).map((m) => {
        const s = Number(m.sender_id);
        const r = Number(m.receiver_id);
        return s === idNum ? r : s;
      })
    )
  );

  const list = [];
  for (const partnerId of uniquePartners) {
    let name = `User #${partnerId}`;
    
    // Check students first
    const { data: student } = await supabase
      .from("students")
      .select("name")
      .eq("id", partnerId)
      .maybeSingle();
      
    if (student) {
      name = student.name;
    } else {
      // Check teachers
      const { data: teacher } = await supabase
        .from("teachers")
        .select("name")
        .eq("id", partnerId)
        .maybeSingle();
      if (teacher) {
        name = teacher.name;
      }
    }
    
    list.push({ chat_user_id: partnerId, name });
  }

  return list;
}

export async function getMessages(user1, user2) {
  const supabase = createSupabaseServerClient();
  const u1 = Number(user1);
  const u2 = Number(user2);
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${u1},receiver_id.eq.${u2}),and(sender_id.eq.${u2},receiver_id.eq.${u1})`
    )
    .order("id", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function sendMessage(senderId, receiverId, message) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: Number(senderId),
      receiver_id: Number(receiverId),
      message: message,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getLatestMessage(userId) {
  const supabase = createSupabaseServerClient();
  const idNum = Number(userId);
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("receiver_id", idNum)
    .order("id", { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0] || null;
}

export async function updateStudentProfile(id, profileData) {
  const supabase = createSupabaseServerClient();
  const idNum = Number(id);
  const { data, error } = await supabase
    .from("students")
    .update(profileData)
    .eq("id", idNum)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTeacherProfile(id, profileData) {
  const supabase = createSupabaseServerClient();
  const idNum = Number(id);
  const { data, error } = await supabase
    .from("teachers")
    .update(profileData)
    .eq("id", idNum)
    .select()
    .single();
  if (error) throw error;
  return data;
}