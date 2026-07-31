import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Download, MagnifyingGlass, ArrowLeft, Trash, Star } from "@phosphor-icons/react"
import { QuestionSubmission } from "@/types"
import { exportToCSV } from "@/lib/csv-export"
import { toast } from "sonner"

interface AdminDashboardProps {
  submissions: QuestionSubmission[]
  userLogin: string
  showViewQuestionsLink: boolean
  setShowViewQuestionsLink: (value: boolean) => void
  onDeleteQuestion?: (id: string) => void
  onToggleFavorite?: (id: string) => void
}

export function AdminDashboard({ submissions, userLogin, showViewQuestionsLink, setShowViewQuestionsLink, onDeleteQuestion, onToggleFavorite }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions

    const query = searchQuery.toLowerCase()
    return submissions.filter(
      (sub) => sub.question.toLowerCase().includes(query)
    )
  }, [submissions, searchQuery])

  const handleExport = () => {
    if (submissions.length === 0) {
      toast.error("No questions to export")
      return
    }

    try {
      exportToCSV(submissions)
      toast.success(`Exported ${submissions.length} questions`)
    } catch (error) {
      toast.error("Failed to export data")
    }
  }

  const handleDelete = (id: string, question: string) => {
    if (onDeleteQuestion) {
      onDeleteQuestion(id)
      toast.success("Question deleted")
    }
  }

  const handleToggleFavorite = (id: string, currentStatus: boolean) => {
    if (onToggleFavorite) {
      onToggleFavorite(id)
      toast.success(currentStatus ? "Removed from favorites" : "Added to favorites")
    }
  }

  return (
    <div className="min-h-screen bg-white w-full" style={{ padding: '5vw', maxWidth: '2160px', margin: '0 auto' }}>
      <div className="mx-auto" style={{ maxWidth: '43.75vw' }}>
        <Link
          to="/"
          className="flex items-center text-foreground hover:text-accent transition-colors cursor-pointer"
          style={{ fontSize: '1.125vw', marginBottom: '0.625vw', gap: '0.5rem' }}
        >
          <ArrowLeft style={{ width: '1.25vw', height: '1.25vw' }} />
          Back
        </Link>

        <div style={{ marginBottom: '3.125vw' }}>
          <h1 className="font-bold tracking-tight" style={{ fontSize: '3.125vw' }}>
            Questions Dashboard
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: '1.25vw', marginBottom: '1.25vw' }}>
            Logged in as <span className="font-semibold text-foreground">{userLogin}</span>
          </p>
          <div className="flex items-center" style={{ gap: '1.875vw' }}>
            <Label htmlFor="view-questions-toggle" className="cursor-pointer" style={{ fontSize: '1.125vw' }}>
              Show "View Questions" Link
            </Label>
            <Switch
              id="view-questions-toggle"
              checked={showViewQuestionsLink}
              onCheckedChange={setShowViewQuestionsLink}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-8" style={{ gap: '3.75vw', marginBottom: '1.67vw' }}>
          <div className="flex-1 relative" style={{ maxWidth: '34.375vw' }}>
            <MagnifyingGlass
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              style={{ width: '1.5vw', height: '1.5vw', left: '1vw' }}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="bg-transparent"
              style={{ height: '3.5vw', fontSize: '1.125vw', paddingLeft: '3.5vw' }}
            />
          </div>

          <div className="flex items-center" style={{ gap: '2.5vw' }}>
            <span className="text-muted-foreground" style={{ fontSize: '1vw' }}>
              {filteredSubmissions.length} {filteredSubmissions.length === 1 ? "Question" : "Questions"}
            </span>
            <Button
              onClick={handleExport}
              disabled={submissions.length === 0}
              size="lg"
              className="gap-2 cursor-pointer"
              style={{ backgroundColor: '#001141', paddingLeft: '1.5vw', paddingRight: '1.5vw', fontSize: '1.125vw', borderRadius: '4px' }}
            >
              <Download style={{ width: '1.375vw', height: '1.375vw' }} weight="bold" />
              Export CSV
            </Button>
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="text-center" style={{ paddingTop: '12.5vw', paddingBottom: '12.5vw' }}>
            <p className="text-muted-foreground" style={{ fontSize: '1.5vw' }}>
              {searchQuery.trim() ? "No questions match your search" : "No questions submitted yet"}
            </p>
          </div>
        ) : (
          <div>
            <TooltipProvider delayDuration={300}>
              <Table className="table-fixed w-full">
                <TableBody>
                  {filteredSubmissions.map((submission) => {
                    const date = new Date(submission.timestamp)
                    const isHovered = hoveredRow === submission.id
                    return (
                      <TableRow 
                        key={submission.id} 
                        className="hover:bg-muted/30 group relative"
                        onMouseEnter={() => setHoveredRow(submission.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <TableCell style={{ fontSize: '1vw', color: '#314468' }}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate">
                                {submission.question}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent 
                              side="top" 
                              align="start"
                              className="max-w-md"
                              style={{ fontSize: '1vw', maxWidth: '31.25vw' }}
                              sideOffset={5}
                            >
                              {submission.question}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-right shrink-0 relative" style={{ color: '#5f7587', width: '12.5vw', fontSize: '0.875vw' }}>
                          <div className="relative">
                            <div className={`transition-opacity duration-150 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                              <div>{date.toLocaleDateString()}</div>
                              <div>{date.toLocaleTimeString()}</div>
                            </div>
                            <div 
                              className={`absolute inset-0 flex items-center justify-end pr-2 transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                              style={{
                                background: 'linear-gradient(to right, transparent, rgb(var(--color-muted) / 0.3) 20%, rgb(var(--color-muted) / 0.3) 100%)',
                                gap: '1.25vw',
                                paddingRight: '1.25vw'
                              }}
                            >
                              <button
                                onClick={() => handleToggleFavorite(submission.id, submission.isFavorite || false)}
                                className="rounded-md border transition-all duration-200 hover:bg-[#001141] [&:hover>*]:text-white z-10 cursor-pointer"
                                style={{
                                  borderColor: '#001141',
                                  color: '#001141',
                                  padding: '0.35vw',
                                  borderRadius: '4px'
                                }}
                                aria-label={submission.isFavorite ? "Remove from favorites" : "Add to favorites"}
                              >
                                <Star className="transition-colors duration-200" style={{ width: '1.25vw', height: '1.25vw' }} weight={submission.isFavorite ? "fill" : "regular"} />
                              </button>
                              <button
                                onClick={() => handleDelete(submission.id, submission.question)}
                                className="rounded-md border border-red-500 text-red-500 transition-all duration-200 hover:bg-red-500 [&:hover>*]:text-white z-10 cursor-pointer"
                                style={{
                                  padding: '0.35vw',
                                  borderRadius: '4px'
                                }}
                                aria-label="Delete question"
                              >
                                <Trash className="transition-colors duration-200" style={{ width: '1.25vw', height: '1.25vw' }} />
                              </button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  )
}
