import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useKV } from "@github/spark/hooks"
import { QuestionForm } from "@/components/QuestionForm"
import { AdminDashboard } from "@/components/AdminDashboard"
import { Toaster } from "@/components/ui/sonner"
import { QuestionSubmission } from "@/types"
import { useEffect, useState } from "react"

function App() {
  const [submissions, setSubmissions] = useKV<QuestionSubmission[]>("virtuoso-questions", [])
  const [showViewQuestionsLink, setShowViewQuestionsLink] = useKV<boolean>("show-view-questions-link", false)
  const [isVirtuosoUser, setIsVirtuosoUser] = useState(false)
  const [userLogin, setUserLogin] = useState<string>("")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await window.spark.user()
        if (user && user.login.toLowerCase().includes("virtuoso")) {
          setIsVirtuosoUser(true)
          setUserLogin(user.login)
        }
      } catch (error) {
        console.error("Failed to check user authentication")
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkUser()
  }, [])

  const handleQuestionSubmit = (question: Omit<QuestionSubmission, "id" | "timestamp">) => {
    const newSubmission: QuestionSubmission = {
      id: crypto.randomUUID(),
      ...question,
      timestamp: Date.now()
    }

    setSubmissions((current) => [...(current || []), newSubmission])
  }

  const handleDeleteQuestion = (id: string) => {
    setSubmissions((current) => (current || []).filter(sub => sub.id !== id))
  }

  const handleToggleFavorite = (id: string) => {
    setSubmissions((current) =>
      (current || []).map(sub =>
        sub.id === id ? { ...sub, isFavorite: !sub.isFavorite } : sub
      )
    )
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-muted-foreground" style={{ fontSize: '54px' }}>Loading...</div>
        </div>
      </div>
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
                showViewQuestionsLink={showViewQuestionsLink ?? false}
                submissions={submissions || []}
              />
            }
          />
          <Route
            path="/admin"
            element={
              isVirtuosoUser ? (
                <AdminDashboard
                  submissions={submissions || []}
                  userLogin={userLogin}
                  showViewQuestionsLink={showViewQuestionsLink ?? false}
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