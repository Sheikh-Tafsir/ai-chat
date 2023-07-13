'use client'

import 'regenerator-runtime'

import React, { useState } from 'react'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'
import useClipboard from 'react-use-clipboard'

export default function TextToSpeech() {
  const [textToCopy, setTextToCopy] = useState('')
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000
  })

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' })
  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition()

  const stopListening = () => {
    SpeechRecognition.stopListening()
  }

  if (!browserSupportsSpeechRecognition) {
    console.log('Not supported------------------------')
    /* return null */
  }

  return (
    <div>
      <h2>Speech to Text Converter</h2>
      <br />
      <p>
        A React hook that converts speech from the microphone to text and makes
        it available to your React components.
      </p>

      <div className="main-content" onClick={() => setTextToCopy(transcript)}>
        {transcript}
      </div>

      <div className="btn-style">
        <button onClick={setCopied}>
          {isCopied ? 'Copied!' : 'Copy to clipboard'}
        </button>
        <button onClick={startListening}>Start Listening</button>
        <button onClick={stopListening}>Stop Listening</button>
      </div>
    </div>
  )
}
