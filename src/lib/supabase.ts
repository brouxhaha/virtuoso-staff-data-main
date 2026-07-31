import { createClient } from "@supabase/supabase-js"
import { QuestionSubmission } from "@/types"

const supabaseUrl = "https://aeofbymonsgllylvwjkv.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchRecentQuestions(): Promise<QuestionSubmission[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("id, question, created_at, favorite")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) throw error
  return data ?? []
}

export async function insertQuestion(question: string): Promise<QuestionSubmission> {
  const { data, error } = await supabase
    .from("questions")
    .insert({ question })
    .select("id, question, created_at, favorite")
    .single()

  if (error) throw error
  return data
}

export async function deleteQuestion(id: number): Promise<void> {
  const { error } = await supabase.from("questions").delete().eq("id", id)
  if (error) throw error
}

export async function toggleFavorite(id: number, current: boolean): Promise<void> {
  const { error } = await supabase
    .from("questions")
    .update({ favorite: !current })
    .eq("id", id)
  if (error) throw error
}
