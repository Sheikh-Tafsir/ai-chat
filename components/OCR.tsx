'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { useState } from 'react'
import { Skeleton } from './ui/skeleten'

export default function OCR({ setInput }) {
  const [imageSrc, setImageSrc] = useState<any>()
  const [btnDisabled, setBtnDisabled] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleOnChange = (changeEvent: any) => {
    const reader = new FileReader()

    reader.onload = onLoadEvent => {
      if (onLoadEvent?.target?.result) {
        setImageSrc(onLoadEvent.target.result)
        setBtnDisabled(false)
      }
    }

    reader.readAsDataURL(changeEvent.target.files[0])
  }

  const handleOnSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    if (!imageSrc) {
      return
    }

    try {
      const formData = new FormData()
      formData.append('image', imageSrc)
      let data: any = await fetch('/api/ocr', {
        method: 'POST',
        body: formData
      })

      data = await data.json()
      setInput(data?.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="block">
      <form onChange={handleOnChange} onSubmit={handleOnSubmit}>
        {loading ? (
          <Skeleton className={buttonVariants() + ' ' + 'float-right ml-4'}>
            Loading
          </Skeleton>
        ) : (
          <Button
            onClick={handleOnSubmit}
            disabled={btnDisabled}
            className="float-right ml-4"
          >
            Detect Text
          </Button>
        )}
        <div className="float-right">
          <label
            htmlFor="file"
            className={buttonVariants() + ' ' + 'bg-green-500'}
          >
            <input type="file" name="file" id="file" className="hidden" />
            Select image
          </label>
        </div>
      </form>
    </div>
  )
}
