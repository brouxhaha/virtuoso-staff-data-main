import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PaperPlaneRight } from "@phosphor-icons/react"
import { toast } from "sonner"
import { FeedbackSubmission } from "@/types"

interface FeedbackFormProps {
  onSubmit: (feedback: Omit<FeedbackSubmission, "id" | "timestamp">) => void
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      onSubmit({ name: name.trim(), email: email.trim(), message: message.trim() })
      toast.success("Thank you for your feedback!")
      setName("")
      setEmail("")
      setMessage("")
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-16 bg-gradient-to-br from-background via-muted/30 to-background">
      <Card className="w-full max-w-4xl p-16 shadow-2xl border-2">
        <div className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Welcome to Virtuoso
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We value your feedback and are excited to hear from you. Please share your thoughts, suggestions, 
            or any questions you may have. Your input helps us shape the future of our services.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-lg font-medium">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="h-14 text-lg"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-lg font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="h-14 text-lg"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="message" className="text-lg font-medium">
              Your Feedback
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts, ideas, or questions here..."
              className="min-h-48 text-lg resize-none"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full h-16 text-xl font-semibold bg-accent hover:bg-accent/90 text-accent-foreground gap-3"
          >
            <PaperPlaneRight size={24} weight="fill" />
            {isSubmitting ? "Sending..." : "Submit Feedback"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
