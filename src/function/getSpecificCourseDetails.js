import supabase from "../util/supabase/supabase";

export const fetchCourseById = async (courseId) => {
  // console.log('Fetching details for course id', courseId);

  if (!courseId) throw new Error("courseId is required");

  const res = await supabase.from("courses")
    .select(`id,title,description,price,status,feature,is_active,is_completed,thumbnail,is_admin_block,created_at,category:categories (*),instructor:instructors (*)
    `).eq("id", courseId).single();
  // console.log('Response for fetching specific course details', res);

  if (res?.error) throw res?.error;

  return res?.data;
};