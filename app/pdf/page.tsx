'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { useState } from 'react'

export default function ShowPdf() {
  const [imageSrc, setImageSrc] = useState<any>()
  const [btnDisabled, setBtnDisabled] = useState(true)

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

    if (!imageSrc) {
      console.log('NO image')
      return
    }

    try {
      const formData = new FormData()
      formData.append('pdf', imageSrc)
      let data: any = await fetch('/api/pdf', {
        method: 'POST',
        body: formData
      })

      console.log(data)
      data = await data.json()
      console.log(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form onChange={handleOnChange} onSubmit={handleOnSubmit}>
        <Button
          onClick={handleOnSubmit}
          disabled={btnDisabled}
          className="float-right ml-4"
        >
          Detect Text
        </Button>
        <div className="float-right">
          <label
            htmlFor="file"
            className={buttonVariants() + ' ' + 'bg-green-500'}
          >
            <input type="file" name="file" id="file" className="hidden" />
            Select Pdf
          </label>
        </div>
      </form>
    </div>
  )
}
