'use client'

import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello, I am Thermos AI Climate Agent. Ask me anything about urban heat islands, spatial cooling metrics, or local mitigation recommendations.'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const newMessages = [...messages, { role: 'user', content: text } as Message]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    // Simulate RAG chatbot service API post to /chat
    setTimeout(() => {
      setIsLoading(false)
      
      let answer = ""
      const textLower = text.toLowerCase()

      if (textLower.includes("jaipur")) {
        answer = "**Environmental Causes:**\n- Desert margin thermal advection carrying dry warm air currents.\n- High concrete fraction (approx 65%) creating thermal density sinks.\n- Lack of dense vegetation shade networks to absorb solar radiation.\n\n**Heat Risk Analysis:**\n- Increased energy loads for cooling, stressing the local grid.\n- High thermal index causing heat strokes and cardiovascular strain among outdoor workers.\n\n**Actionable Solutions:**\n- Install Targeted Urban Tree Canopies to shade pedestrian arteries.\n- Enforce High-Albedo Reflective Paint coating policies for all flat rooftops."
      } else if (textLower.includes("delhi")) {
        answer = "**Environmental Causes:**\n- Severe building congestion restricting cross-wind cooling ventilation.\n- High vehicular heat dissipation coupled with micro-particulate atmospheric blankets.\n- Extremely low tree-canopy percentages in dense suburban corridors.\n\n**Heat Risk Analysis:**\n- High particulate thermal trapping exacerbating breathing disorders.\n- Urban core temperatures running 4-6°C higher than surrounding rural plains (Severe UHI effect).\n\n**Actionable Solutions:**\n- Restore micro-lakes and urban wetlands to generate local evaporative cooling.\n- Incentivize extensive green roof retrofits on multi-family apartment complexes."
      } else {
        answer = "**Environmental Causes:**\n- High density of low-albedo concrete materials absorbing shortwave solar energy.\n- Anthropogenic heat emissions from transit systems and HVAC exhaust vents.\n\n**Heat Risk Analysis:**\n- Severe Urban Heat Island effect amplifying nighttime temperatures, preventing heat relief.\n- Runoff water overheating, which degrades local aquatic ecosystems.\n\n**Actionable Solutions:**\n- Implement Permeable Cool Pavement aggregates on city walkways and secondary lanes.\n- Mandate horizontal green space provisions in commercial real-estate codes."
      }

      setMessages([...newMessages, { role: 'assistant', content: answer }])
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-6 flex flex-col h-[78vh]">
      <div>
        <h1 className="font-display font-bold text-3xl text-white">AI Climate Consultant</h1>
        <p className="text-sm text-gray-400">LangChain powered RAG specialist for urban cooling policy</p>
      </div>

      {/* Chat Window */}
      <div className="flex-grow glass-card rounded-2xl p-6 overflow-y-auto space-y-4 flex flex-col justify-between min-h-[350px]">
        <div className="space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white/5 border border-white/5 text-gray-200'
                }`}
              >
                {/* Parse newline markdown basics */}
                {m.content.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('-') ? 'pl-4 -indent-4 mt-1' : 'mt-1'}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-gray-400 italic">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Prompts */}
        {messages.length === 1 && (
          <div className="pt-6 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleSendMessage("Why is Jaipur overheating?")}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs hover:border-primary/50 text-gray-300 hover:text-white transition-all"
            >
              Why is Jaipur overheating?
            </button>
            <button
              onClick={() => handleSendMessage("What is the UHI effect in Delhi?")}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs hover:border-primary/50 text-gray-300 hover:text-white transition-all"
            >
              What is the UHI effect in Delhi?
            </button>
          </div>
        )}
      </div>

      {/* Input Console */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about cooling policies, vegetation indexes, or thermal anomalies..."
          className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(input)
          }}
        />
        <button
          onClick={() => handleSendMessage(input)}
          className="px-6 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  )
}
