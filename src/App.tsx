import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QuestionForm } from "@/components/QuestionForm"
import { AdminDashboard } from "@/components/AdminDashboard"
import { Toaster } from "@/components/ui/sonner"
import { QuestionSubmission } from "@/types"
import { useEffect, useState } from "react"
import {
  fetchRecentQuestions,
  insertQuestion,
  deleteQuestion,
  toggleFavorite,
} from "@/lib/supabase"

function App() {
  const [submissions, setSubmissions] = useState<QuestionSubmission[]>([])
  const [showViewQuestionsLink, setShowViewQuestionsLink] = useState(false)
  const isVirtuosoUser = false
  const userLogin = ""

  useEffect(() => {
    fetchRecentQuestions()
      .then(setSubmissions)
      .catch(() => console.error("Failed to load questions"))
  }, [])

  const handleQuestionSubmit = async (question: string) => {
    const newSubmission = await insertQuestion(question)
    setSubmissions((current) => [newSubmission, ...current].slice(0, 10))
  }

  const handleDeleteQuestion = async (id: number) => {
    await deleteQuestion(id)
    setSubmissions((current) => current.filter((sub) => sub.id !== id))
  }

  const handleToggleFavorite = async (id: number) => {
    const sub = submissions.find((s) => s.id === id)
    if (!sub) return
    await toggleFavorite(id, sub.favorite)
    setSubmissions((current) =>
      current.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s))
    )
  }

  return (
    <div 
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundColor: '#f5f5f5'
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <QuestionForm 
                onSubmit={handleQuestionSubmit}
                isVirtuosoUser={isVirtuosoUser}
                showViewQuestionsLink={showViewQuestionsLink}
                submissions={submissions}
              />
            }
          />
          <Route
            path="/admin"
            element={
              isVirtuosoUser ? (
                <AdminDashboard
                  submissions={submissions}
                  userLogin={userLogin}
                  showViewQuestionsLink={showViewQuestionsLink}
                  setShowViewQuestionsLink={setShowViewQuestionsLink}
                  onDeleteQuestion={handleDeleteQuestion}
                  onToggleFavorite={handleToggleFavorite}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  )
}

export default App