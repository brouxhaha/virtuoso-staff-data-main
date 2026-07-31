import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUp } from "@phosphor-icons/react"
import { toast } from "sonner"
import { QuestionSubmission } from "@/types"

interface QuestionFormProps {
  onSubmit: (question: string) => Promise<void>
  isVirtuosoUser: boolean
  showViewQuestionsLink: boolean
  submissions: QuestionSubmission[]
}

export function QuestionForm({ onSubmit, isVirtuosoUser, showViewQuestionsLink, submissions }: QuestionFormProps) {
  const [question, setQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = textareaRef.current.scrollWidth * 0.02946875 * 1.2 * 4 + textareaRef.current.scrollWidth * 0.0078125 * 2
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }, [question])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim()) {
      toast.error("Please enter a question")
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(question.trim())
      toast.success("Thank you for your question!")
      setQuestion("")
      textareaRef.current?.focus()
    } catch (error) {
      toast.error("Failed to submit question. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen w-full" style={{ backgroundColor: 'white', maxWidth: '2160px', margin: '0 auto', padding: '0.625vw 6.25vw' }}>
      <div className="w-full flex-1 flex flex-col h-full" style={{ paddingTop: '3.9vw' }}>
        {isVirtuosoUser && showViewQuestionsLink && (
          <div className="absolute" style={{ top: '0.3125vw', right: '0.3125vw' }}>
            <Link
              to="/admin"
              className="hover:text-accent underline underline-offset-4 transition-colors font-medium text-slate-900 cursor-pointer"
              style={{ fontSize: '1.6375vw' }}
            >View Questions</Link>
          </div>
        )}

        <div className="text-center" style={{ marginTop: '4.63vw', marginBottom: 'calc(6.9425vw + 40px)' }}>
          <div className="flex items-center justify-center">
            <h1 className="font-bold tracking-tight" style={{ marginBottom: '0.390625vw', fontSize: '5.458125vw', lineHeight: '1.1' }}>What would you ask the Virtuoso intelligence capability?</h1>
          </div>
          
          <div className="text-muted-foreground w-full">
            <p className="w-full" style={{ fontSize: '2.946875vw', lineHeight: '1.3' }}>While you won't get a response here, we'd love to know what questions you'd like answered. This will help us understand what you would like to know within the Virtuoso network.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative" style={{ minHeight: '5.78125vw', marginBottom: '8.678125vw' }}>
          <div className="absolute inset-x-0 bottom-0">
            <Textarea
              ref={textareaRef}
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What would you like to know?"
              className="border-2 resize-none overflow-y-auto flex items-center"
              style={{ backgroundColor: 'white', paddingLeft: '1.875vw', paddingRight: '6.875vw', fontSize: '2.946875vw', lineHeight: '1.2', paddingTop: '0.78125vw', paddingBottom: '0.78125vw', minHeight: '5.78125vw', maxHeight: 'calc(2.946875vw * 1.2 * 4 + 0.78125vw * 2)' }}
              disabled={isSubmitting}
              autoFocus
              rows={1}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !question.trim()}
              size="icon"
              className="absolute rounded-lg hover:bg-foreground disabled:bg-muted disabled:opacity-50 cursor-pointer"
              style={{ right: '1.25vw', height: '4.21875vw', width: '4.21875vw', bottom: '0.78125vw', backgroundColor: '#001141' }}
            >
              <ArrowUp className="text-background" weight="bold" style={{ width: '2.109375vw', height: '2.109375vw' }} />
            </Button>
          </div>
        </form>

        {submissions.length > 0 && (
          <div className="relative flex-1 min-h-0" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 className="font-medium" style={{ fontFamily: 'sofia-pro, sans-serif', color: '#192B55', marginBottom: '0.234375vw', fontSize: '3.275vw', flexShrink: 0 }}>Recently submitted questions</h2>
            <div className="relative overflow-hidden h-full" style={{ flex: 1, minHeight: 0 }}>
              <div className="overflow-y-auto h-full" style={{ display: 'flex', flexDirection: 'column', gap: '3.125vw', paddingBottom: '1.5625vw', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {submissions.slice(-10).reverse().map((submission) => (
                  <div
                    key={submission.id}
                    style={{ color: '#314468', fontSize: '2.6203125vw' }}
                  >
                    {submission.question}
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white to-transparent" style={{ height: '20vw' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
