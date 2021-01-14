import { useRef, useEffect, useCallback } from 'react'

// cross-browser get array of speech synthesis voices
function getVoices() {
  return new Promise<SpeechSynthesisVoice[]>(resolve => {
    let vs = window.speechSynthesis.getVoices()

    if (vs.length) {
      resolve(vs)
      return
    }

    // chrome fires an event when voices ready
    window.speechSynthesis.onvoiceschanged = (event) => {
      vs = (event.target as SpeechSynthesis).getVoices()
      resolve(vs)
    }
  })
}

// choose iOS voice samantha or win10 voice zira if available, otherwise default to first en-US voice
async function chooseVoice() {
  const voices = (await getVoices()).filter(voice => voice.lang === 'en-US')

  const samantha = voices.filter(voice => voice.name === 'Samantha')
  const zira = voices.filter(voice => voice.name === 'Microsoft Zira Desktop - English (United States)')

  return new Promise<SpeechSynthesisVoice>(resolve => {
    if (samantha.length) {
      resolve(samantha[0])
    }

    if (zira.length) {
      resolve(zira[0])
    }

    resolve(voices[0])
  })
}

export const useSpeech = () => {
  const voiceRef = useRef<SpeechSynthesisVoice>(null)

  useEffect(() => {
    const setVoiceRef = async () => {
      voiceRef.current = await chooseVoice()
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setVoiceRef()
    } else {
      console.warn('text-to-speech not supported')
    }
  }, [])

  const speak = useCallback((phrase: string) => {
    if (!voiceRef.current) {
      return
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }

    // create a new instance each time or else firefox won't repeat
    const utterance = new SpeechSynthesisUtterance(phrase)
    utterance.voice = voiceRef.current
    window.speechSynthesis.speak(utterance)
  }, [])

  return speak
}
