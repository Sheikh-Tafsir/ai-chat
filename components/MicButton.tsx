'use client'

import 'regenerator-runtime'
import { Button } from '@/components/ui/button'
import { IconMic } from './ui/icons'

import React, { useState } from 'react'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'

export default function MicButton({ setInput }: { setInput: any }) {
  const [clicked, setClicked] = useState(false)

  let { transcript, resetTranscript } = useSpeechRecognition()

  const onClick = () => {
    if (clicked) {
      setInput(transcript)
      SpeechRecognition.stopListening()
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' })
    }
    setClicked(click => !click)
    resetTranscript()
  }

  return (
    <Button className="mx-2" type="button" onClick={onClick}>
      <IconMic />
    </Button>
  )
}
