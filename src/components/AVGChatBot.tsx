'use client'

import { useState, useRef, useEffect } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import CameraCapture from './CameraCapture'
import ResponseActions from './ResponseActions'

interface UploadedFile {
  id: string
  name: string
  type: 'image' | 'document' | 'data' | 'audio'
  preview: string | null
  content: string
  size: number
  uploadedAt: Date
  selected: boolean
}

// AVG-specific quick prompts
const AVG_QUICK_PROMPTS = [
  {
    category: "Privacy Beleid",
    icon: "📄",
    prompts: [
      "Controleer mijn privacy beleid op AVG-compliance",
      "Help me een privacy beleid opstellen voor een [sector] organisatie",
      "Welke informatie moet ik opnemen in mijn privacy statement?",
      "Hoe schrijf ik een duidelijke privacyverklaring voor klanten?"
    ]
  },
  {
    category: "DPIA & Risico's",
    icon: "🔍", 
    prompts: [
      "Wanneer moet ik een DPIA uitvoeren?",
      "Help me een DPIA opstellen voor [systeem/proces]",
      "Hoe doe ik een AVG-risicoanalyse?",
      "Welke beveiligingsmaatregelen zijn verplicht onder de AVG?"
    ]
  },
  {
    category: "Datalekken",
    icon: "🚨",
    prompts: [
      "Wat moet ik doen bij een datalek? Geef me het stappenplan",
      "Wanneer moet ik een datalek melden bij de Autoriteit Persoonsgegevens?",
      "Hoe informeer ik betrokkenen over een datalek?",
      "Help me een incident response plan opstellen"
    ]
  },
  {
    category: "Rechten Betrokkenen",
    icon: "👤",
    prompts: [
      "Hoe behandel ik een verzoek tot inzage?",
      "Wanneer mag ik een verzoek tot vergetelheid weigeren?",
      "Help me een procedure voor betrokkenenrechten opstellen",
      "Hoe verwerk ik een bezwaar tegen direct marketing?"
    ]
  },
  {
    category: "Contracten & Afspraken",
    icon: "📝",
    prompts: [
      "Controleer mijn verwerkersovereenkomst",
      "Help me een verwerkersovereenkomst opstellen",
      "Wat moet er in een joint controller overeenkomst?",
      "Welke AVG-clausules horen in mijn algemene voorwaarden?"
    ]
  }
]

export default function AVGChatBot() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [streamingResponse, setStreamingResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isWaitingForStream, setIsWaitingForStream] = useState(false)
  const [aiModel, setAiModel] = useState<'pro' | 'smart' | 'internet'>('smart')
  const [useGrounding, setUseGrounding] = useState(true)
  const [groundingData, setGroundingData] = useState<any>(null)
  const [showQuickPrompts, setShowQuickPrompts] = useState(false)

  const [isListening, setIsListening] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [pasteHint, setPasteHint] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Automatically enable grounding when Internet model is selected
  useEffect(() => {
    if (aiModel === 'internet') {
      setUseGrounding(true)
    }
  }, [aiModel])

  // Setup paste event listeners
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.addEventListener('paste', handlePaste)
      return () => {
        textarea.removeEventListener('paste', handlePaste)
      }
    }
  }, [])

  // Voice recognition setup
  const initializeVoiceRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'nl-NL'
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setMessage(prev => prev + ' ' + transcript)
        }
        
        recognition.onend = () => {
          setIsListening(false)
        }
        
        recognition.onerror = () => {
          setIsListening(false)
        }
        
        return recognition
      }
    }
    return null
  }

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeVoiceRecognition()
    }
    
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
        setIsListening(false)
      } else {
        recognitionRef.current.start()
        setIsListening(true)
      }
    }
  }

  const handleCameraCapture = (imageData: string, blob: Blob) => {
    const uploadedFile: UploadedFile = {
      id: generateFileId(),
      name: `AVG_Document_${new Date().toLocaleTimeString()}.jpg`,
      type: 'image',
      preview: imageData,
      content: imageData,
      size: blob.size,
      uploadedAt: new Date(),
      selected: true
    }
    
    addUploadedFile(uploadedFile)
  }

  const generateFileId = () => `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const addUploadedFile = (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file])
  }

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const toggleFileSelection = (id: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, selected: !file.selected } : file
      )
    )
  }

  const selectAllFiles = () => {
    setUploadedFiles(prev => prev.map(file => ({ ...file, selected: true })))
  }

  const deselectAllFiles = () => {
    setUploadedFiles(prev => prev.map(file => ({ ...file, selected: false })))
  }

  const getSelectedFiles = () => uploadedFiles.filter(file => file.selected)

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    // Check for images first
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const result = event.target?.result as string
            
            const uploadedFile: UploadedFile = {
              id: generateFileId(),
              name: file.name || 'AVG Document (Geplakt)',
              type: 'image',
              preview: result,
              content: result,
              size: file.size,
              uploadedAt: new Date(),
              selected: true
            }
            
            addUploadedFile(uploadedFile)
            setPasteHint('📸 Document geplakt voor AVG-analyse!')
            setTimeout(() => setPasteHint(''), 3000)
          }
          reader.readAsDataURL(file)
        }
        return
      }
    }

    // Check for text/URLs
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      if (item.type === 'text/plain') {
        item.getAsString(async (pastedText) => {
          const urlRegex = /(https?:\/\/[^\s]+)/g
          const urls = pastedText.match(urlRegex)
          
          if (urls && urls.length === 1 && pastedText.trim() === urls[0]) {
            e.preventDefault()
            try {
              await handleUrlPaste(urls[0])
            } catch (error) {
              setMessage(prev => prev + pastedText)
            }
          } else {
            setPasteHint('📝 Tekst geplakt!')
            setTimeout(() => setPasteHint(''), 2000)
          }
        })
        return
      }
    }
  }

  const handleUrlPaste = async (url: string) => {
    setPasteHint('🔗 URL wordt geanalyseerd...')
    
    try {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
      const isImageUrl = imageExtensions.some(ext => url.toLowerCase().includes(ext))
      
      if (isImageUrl) {
        const uploadedFile: UploadedFile = {
          id: generateFileId(),
          name: 'AVG Document (URL)',
          type: 'image',
          preview: url,
          content: url,
          size: 0,
          uploadedAt: new Date(),
          selected: true
        }
        
        addUploadedFile(uploadedFile)
        setPasteHint('🖼️ Document URL geladen!')
        setTimeout(() => setPasteHint(''), 3000)
      } else {
        setMessage(prev => prev + (prev ? '\n\n' : '') + `🔗 Analyseer deze URL voor AVG-compliance: ${url}`)
        setPasteHint('🔗 URL toegevoegd voor AVG-analyse!')
        setTimeout(() => setPasteHint(''), 3000)
      }
    } catch (error) {
      console.error('URL paste error:', error)
      setMessage(prev => prev + url)
      setPasteHint('❌ URL als tekst geplakt')
      setTimeout(() => setPasteHint(''), 3000)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      if (files.length === 1) {
        await handleFileUpload(files[0])
      } else {
        await handleMultipleFileUpload(files)
      }
    }

    const text = e.dataTransfer.getData('text/plain')
    if (text && !files.length) {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const urls = text.match(urlRegex)
      
      if (urls && urls.length === 1 && text.trim() === urls[0]) {
        await handleUrlPaste(urls[0])
      } else {
        setMessage(prev => prev + (prev ? '\n\n' : '') + text)
        setPasteHint('📝 Tekst gedropt!')
        setTimeout(() => setPasteHint(''), 2000)
      }
    }
  }

  const handleFileUpload = async (file: File) => {
    return handleSingleFileUpload(file)
  }

  const handleMultipleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const uploadPromises = fileArray.map(file => handleSingleFileUpload(file))
    await Promise.all(uploadPromises)
  }

  const handleSingleFileUpload = async (file: File) => {
    const fileName = file.name.toLowerCase()
    const fileType = file.type.toLowerCase()
    
    const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
    const documentFormats = ['docx', 'pdf', 'txt', 'md']
    const dataFormats = ['csv', 'json']
    const audioFormats = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'mp4', 'mpeg', 'mpga', 'webm']
    
    const extension = fileName.split('.').pop() || ''
    const isImage = imageFormats.some(format => fileName.endsWith(`.${format}`)) || fileType.startsWith('image/')
    const isDocument = documentFormats.some(format => fileName.endsWith(`.${format}`))
    const isData = dataFormats.some(format => fileName.endsWith(`.${format}`))
    const isAudio = audioFormats.some(format => fileName.endsWith(`.${format}`)) || fileType.startsWith('audio/')
    
    if (!isImage && !isDocument && !isData && !isAudio) {
      alert(`Bestandstype niet ondersteund voor AVG-analyse!\n\nOndersteunde formaten:\n📸 Documenten: ${imageFormats.join(', ')}\n📄 Tekst: ${documentFormats.join(', ')}\n📊 Data: ${dataFormats.join(', ')}\n🎵 Audio: ${audioFormats.join(', ')}`)
      return
    }

    try {
      if (isImage) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          
          const uploadedFile: UploadedFile = {
            id: generateFileId(),
            name: file.name,
            type: 'image',
            preview: result,
            content: result,
            size: file.size,
            uploadedAt: new Date(),
            selected: true
          }
          
          addUploadedFile(uploadedFile)
        }
        reader.onerror = () => {
          alert('Fout bij het lezen van het document')
        }
        reader.readAsDataURL(file)
        return
      }
      
      if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          
          const uploadedFile: UploadedFile = {
            id: generateFileId(),
            name: file.name,
            type: 'document',
            preview: content.length > 100 ? content.substring(0, 100) + '...' : content,
            content: content,
            size: file.size,
            uploadedAt: new Date(),
            selected: true
          }
          
          addUploadedFile(uploadedFile)
        }
        reader.onerror = () => {
          alert('Fout bij het lezen van het tekstbestand')
        }
        reader.readAsText(file, 'UTF-8')
        return
      }
      
      if (fileName.endsWith('.json')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            const jsonData = JSON.parse(content)
            const formattedContent = JSON.stringify(jsonData, null, 2)
            
            const uploadedFile: UploadedFile = {
              id: generateFileId(),
              name: file.name,
              type: 'data',
              preview: formattedContent.length > 100 ? formattedContent.substring(0, 100) + '...' : formattedContent,
              content: formattedContent,
              size: file.size,
              uploadedAt: new Date(),
              selected: true
            }
            
            addUploadedFile(uploadedFile)
          } catch (error) {
            alert('Ongeldig JSON bestand')
          }
        }
        reader.readAsText(file, 'UTF-8')
        return
      }
      
      if (isAudio) {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
          const response = await fetch('/api/transcribe-audio', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Transcriptie mislukt')
          }

          const data = await response.json()
          
          const uploadedFile: UploadedFile = {
            id: generateFileId(),
            name: file.name,
            type: 'audio',
            preview: data.transcription.length > 100 ? data.transcription.substring(0, 100) + '...' : data.transcription,
            content: data.transcription,
            size: file.size,
            uploadedAt: new Date(),
            selected: true
          }
          
          addUploadedFile(uploadedFile)
        } catch (error) {
          console.error('Audio transcription error:', error)
          alert('Fout bij audio transcriptie: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
        } finally {
          setIsLoading(false)
        }
        return
      }
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-docx', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      
      const uploadedFile: UploadedFile = {
        id: generateFileId(),
        name: file.name,
        type: fileName.endsWith('.csv') ? 'data' : 'document',
        preview: data.content.length > 100 ? data.content.substring(0, 100) + '...' : data.content,
        content: data.content,
        size: file.size,
        uploadedAt: new Date(),
        selected: true
      }
      
      addUploadedFile(uploadedFile)
    } catch (error) {
      console.error('File upload error:', error)
      alert('Fout bij uploaden: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    }
  }

  const abortControllerRef = useRef<AbortController | null>(null)
  const currentStreamingResponseRef = useRef<string>('')
  const hasReceivedFirstTokenRef = useRef<boolean>(false)

  const sendMessageStreaming = async () => {
    const selectedFiles = getSelectedFiles()
    
    if (!message.trim() && selectedFiles.length === 0) return

    setIsWaitingForStream(true)
    setIsStreaming(false)
    setIsLoading(false)
    setStreamingResponse('')
    setResponse('')
    currentStreamingResponseRef.current = ''
    hasReceivedFirstTokenRef.current = false

    abortControllerRef.current = new AbortController()

    try {
      // Enhanced AVG-specific context
      const avgContext = `
Je bent een expert AVG (GDPR) compliance assistent voor Nederlandse organisaties. 
Je helpt met praktische toepassing van de Algemene Verordening Gegevensbescherming.

Belangrijke kenmerken van je antwoorden:
- Geef ALTIJD praktische, uitvoerbare adviezen
- Verwijs naar specifieke AVG-artikelen waar relevant
- Vermeld de Nederlandse Autoriteit Persoonsgegevens (AP) richtlijnen
- Gebruik Nederlandse juridische terminologie
- Geef concrete voorbeelden en templates waar mogelijk
- Waarschuw voor juridische risico's en boetes
- Verwijs door naar juristen bij complexe vragen

Voor documenten: analyseer ze grondig op AVG-compliance en geef specifieke verbeterpunten.
`

      const payload: any = { 
        message: avgContext + "\n\n" + message, 
        useGrounding: aiModel === 'internet' ? useGrounding : false,
        aiModel 
      }
      
      if (selectedFiles.length > 0) {
        const selectedImages = selectedFiles.filter(file => file.type === 'image')
        if (selectedImages.length > 0) {
          payload.images = selectedImages.map(img => img.content)
        }
        
        const fileContexts = selectedFiles.map((file, index) => {
          const fileType = file.type === 'image' ? 'AVG Document (Afbeelding)' : 
                          file.type === 'document' ? 'AVG Document' : 
                          file.type === 'audio' ? 'Audio Transcriptie' : 'Data Analyse'
          if (file.type === 'image') {
            return `[${fileType} ${index + 1}: ${file.name}]\n[Document bijgevoegd voor AVG-compliance analyse]`
          } else {
            return `[${fileType}: ${file.name}]\n${file.content}`
          }
        }).join('\n\n---\n\n')
        
        if (message.trim()) {
          payload.message = avgContext + `\n\nVraag: ${message}\n\n=== BIJGEVOEGDE DOCUMENTEN VOOR AVG-ANALYSE ===\n${fileContexts}`
        } else {
          payload.message = avgContext + `\n\nAnalyseer de volgende documenten op AVG-compliance:\n\n${fileContexts}`
        }
      }

      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No readable stream available')
      }

      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.error) {
                throw new Error(data.message || 'Streaming error')
              }
              
              if (data.done) {
                setIsStreaming(false)
                setIsWaitingForStream(false)
                setResponse(currentStreamingResponseRef.current)
                return
              }
              
              if (data.token) {
                if (!hasReceivedFirstTokenRef.current) {
                  hasReceivedFirstTokenRef.current = true
                  setIsWaitingForStream(false)
                  setIsStreaming(true)
                }
                
                const newResponse = currentStreamingResponseRef.current + data.token
                currentStreamingResponseRef.current = newResponse
                setStreamingResponse(newResponse)
              }
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError)
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Streaming error:', error)
      
      if (error.name === 'AbortError') {
        if (!currentStreamingResponseRef.current) {
          setResponse('AVG-analyse gestopt door gebruiker.')
        } else {
          setResponse(currentStreamingResponseRef.current)
        }
      } else {
        setResponse('Error: ' + (error instanceof Error ? error.message : 'Onbekende fout bij AVG-analyse'))
      }
    } finally {
      setIsStreaming(false)
      setIsWaitingForStream(false)
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessageStreaming()
    }
  }

  const insertQuickPrompt = (prompt: string) => {
    setMessage(prompt)
    setShowQuickPrompts(false)
    // Focus textarea
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  return (
    <div className="space-y-6">
      {/* Quick Prompts */}
      <div className="bg-gray-50 rounded-lg p-4">
        <button
          onClick={() => setShowQuickPrompts(!showQuickPrompts)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-sm font-semibold text-gray-800 flex items-center">
            <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs">💡</span>
            </span>
            Snelle AVG-vragen
          </h3>
          <svg className={`w-4 h-4 text-gray-600 transition-transform ${showQuickPrompts ? 'rotate-180' : ''}`} 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showQuickPrompts && (
          <div className="mt-4 space-y-4">
            {AVG_QUICK_PROMPTS.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="text-lg mr-2">{category.icon}</span>
                  {category.category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {category.prompts.map((prompt, promptIndex) => (
                    <button
                      key={promptIndex}
                      onClick={() => insertQuickPrompt(prompt)}
                      className="text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Manager */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center">
              <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">📁</span>
              </span>
              Geüploade Documenten voor AVG-analyse ({uploadedFiles.length})
            </h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => getSelectedFiles().length === uploadedFiles.length ? deselectAllFiles() : selectAllFiles()}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {getSelectedFiles().length === uploadedFiles.length ? 'Deselecteer alles' : 'Selecteer alles'}
              </button>
              <span className="text-xs text-gray-500">
                {getSelectedFiles().length} geselecteerd
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className={`border rounded-lg p-3 transition-all cursor-pointer ${
                  file.selected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={file.selected}
                      onChange={() => toggleFileSelection(file.id)}
                      className="rounded text-blue-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-lg">
                      {file.type === 'image' ? '📄' : file.type === 'document' ? '📋' : file.type === 'audio' ? '🎵' : '📊'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeUploadedFile(file.id)
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Verwijder document"
                  >
                    ×
                  </button>
                </div>
                
                {file.type === 'image' && file.preview && (
                  <div className="mb-2">
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-full h-20 object-cover rounded"
                    />
                  </div>
                )}
                
                <div className="text-xs text-gray-700">
                  <p className="font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  {file.type !== 'image' && (
                    <p className="text-gray-600 mt-1 line-clamp-2">
                      {file.preview}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Model Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-gray-800 font-medium mb-3 flex items-center">
          <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs">🧠</span>
          </span>
          AI Model voor AVG-analyse
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div 
            className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all group hover:shadow-lg ${
              aiModel === 'smart' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => setAiModel('smart')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  aiModel === 'smart' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span className="font-medium text-green-700">⚡ Aanbevolen</span>
              </div>
              <span className="text-xs text-green-600 font-medium">FLASH</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Beste voor AVG-compliance</p>
          </div>

          <div 
            className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all group hover:shadow-lg ${
              aiModel === 'pro' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setAiModel('pro')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  aiModel === 'pro' ? 'bg-purple-500' : 'bg-gray-300'
                }`} />
                <span className="font-medium text-purple-700">🏆 Expert</span>
              </div>
              <span className="text-xs text-purple-600 font-medium">PRO</span>
            </div>
            <p className="text-xs text-purple-600 mt-1">Complexe juridische vragen</p>
          </div>

          <div 
            className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all group hover:shadow-lg ${
              aiModel === 'internet' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setAiModel('internet')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  aiModel === 'internet' ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <span className="font-medium text-blue-700">🌐 Actueel</span>
              </div>
              <span className="text-xs text-blue-600 font-medium">2.0</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">Laatste jurisprudentie</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className={`bg-white rounded-lg border transition-all duration-200 p-4 ${
        isDragOver 
          ? 'border-blue-500 border-2 bg-blue-50' 
          : 'border-gray-200'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>

        {isDragOver && (
          <div className="absolute inset-2 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 bg-opacity-90 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-blue-700 font-semibold">Drop AVG-documenten hier</p>
              <p className="text-blue-600 text-sm">Privacy beleid, contracten, DPIA's, etc.</p>
            </div>
          </div>
        )}

        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isDragOver ? "Drop AVG-documenten hier..." : "Stel je AVG-vraag of upload documenten voor compliance-analyse..."}
              className="w-full p-3 border-0 resize-none focus:outline-none"
              rows={3}
              disabled={isLoading}
            />
            {pasteHint && (
              <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                {pasteHint}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Upload AVG-documenten (privacy beleid, contracten, DPIA's)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            <CameraCapture 
              onCapture={handleCameraCapture}
              disabled={isLoading}
            />
            
            <button
              onClick={toggleVoiceRecognition}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'text-red-600 bg-red-50 animate-pulse' 
                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title={isListening ? "Stop opnamen" : "Spreek je AVG-vraag in"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            <button
              onClick={sendMessageStreaming}
              disabled={(isLoading || isStreaming || isWaitingForStream) || (!message.trim() && getSelectedFiles().length === 0)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <span>{isWaitingForStream ? '🤔' : isStreaming ? '💭' : isLoading ? '⏳' : '🔍'}</span>
              <span className="hidden sm:inline">
                {isWaitingForStream ? 'Analyseren...' : isStreaming ? 'Genereren...' : isLoading ? 'Laden...' : 'AVG Analyse'}
              </span>
            </button>
          </div>
        </div>
        
        {isListening && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
            Luistert naar je AVG-vraag...
          </div>
        )}
      </div>

      {/* Response Area */}
      {isWaitingForStream && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <span className="text-blue-700 font-medium">🔍 AVG-compliance analyse wordt uitgevoerd...</span>
          </div>
          <p className="text-blue-600 text-sm mt-2 ml-12">Ik controleer je documenten op privacywetgeving en zoek naar optimalisaties... ⚖️</p>
        </div>
      )}
      
      {isLoading && !isStreaming && !isWaitingForStream && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-blue-700 text-sm">AVG-expert denkt na...</span>
          </div>
        </div>
      )}

      {(response || streamingResponse || isStreaming) && !isLoading && !isWaitingForStream && (
        <div className={`p-4 rounded-lg ${
          (response && response.startsWith('Error:')) 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <p className={`text-sm font-medium mb-3 ${
            (response && response.startsWith('Error:')) 
              ? 'text-red-800' 
              : 'text-green-800'
          }`}>
            <span className="flex items-center">
              {(response && response.startsWith('Error:')) ? (
                <>❌ Fout bij AVG-analyse:</>
              ) : (
                <>
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    isStreaming ? 'bg-blue-600 animate-pulse' : 'bg-green-600'
                  }`}></span>
                  {isStreaming ? '🔄 Live AVG-analyse:' : '✅ AVG-compliance rapport:'}
                </>
              )}
            </span>
          </p>
          <div className="bg-white p-4 rounded border relative">
            {(response && response.startsWith('Error:')) ? (
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {response}
              </p>
            ) : (
              <div className="relative">
                <MarkdownRenderer 
                  content={isStreaming ? streamingResponse : response} 
                  className="text-gray-700 text-sm"
                />
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1 align-text-bottom"></span>
                )}
              </div>
            )}
          </div>
          
          {!(response && response.startsWith('Error:')) && (
            <ResponseActions 
              content={isStreaming ? streamingResponse : response}
              isMarkdown={true}
              isStreaming={isStreaming}
            />
          )}

          {groundingData && groundingData.isGrounded && !isStreaming && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-3">
                <svg className="w-4 h-4 text-blue-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                </svg>
                <span className="text-blue-800 font-medium text-sm">
                  Gebaseerd op actuele AVG-jurisprudentie en AP-richtlijnen
                </span>
              </div>
              
              {groundingData.sources && groundingData.sources.length > 0 && (
                <div>
                  <p className="text-blue-700 text-xs font-medium mb-2">Juridische bronnen:</p>
                  <div className="space-y-2">
                    {groundingData.sources.slice(0, 3).map((source: any, index: number) => (
                      <div key={index} className="bg-white p-2 rounded border border-blue-200">
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                        >
                          {source.title}
                        </a>
                        {source.snippet && (
                          <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                            {source.snippet}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".docx,.pdf,.txt,.md,.csv,.json,.jpg,.jpeg,.png,.gif,.webp,.bmp,image/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.mp4,.mpeg,.mpga,.webm,audio/*"
        onChange={(e) => {
          const files = e.target.files
          if (files && files.length > 0) {
            if (files.length === 1) {
              handleFileUpload(files[0])
            } else {
              handleMultipleFileUpload(files)
            }
          }
          e.target.value = ''
        }}
        className="hidden"
      />
    </div>
  )
}