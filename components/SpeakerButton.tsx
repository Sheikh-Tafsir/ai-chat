'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { IconSpeaker } from './ui/icons'

const SpeakerButton = ({ text }: { text: string }) => {
  const [clicked, setClicked] = useState(false)

  const onClick = () => {
    if (!clicked) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    } else {
      speechSynthesis.cancel()
    }
    setClicked(click => !click)
  }

  return (
    <Button type="button" variant="outline"  onClick={onClick}>
      <IconSpeaker />
    </Button>
  )
}

export default SpeakerButton
