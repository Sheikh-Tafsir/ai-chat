import rateLimit from '@/lib/rate-limit'

import { kv } from '@vercel/kv'
/* import { OpenAIStream, StreamingTextResponse } from 'ai' */
/* import { Configuration, OpenAIApi } from 'openai-edge' */
/**/
import { auth } from '@clerk/nextjs'
import { nanoid } from '@/lib/utils'
/**/
/* /* export const runtime = 'edge' */
/**/
/* const configuration = new Configuration({ */
/*   apiKey: process.env.OPENAI_API_KEY */
/* }) */
/**/
/* const openai = new OpenAIApi(configuration) */
/**/
/* export async function POST(req: Request) { */
/*   const json = await req.json() */
/*   const { messages, previewToken } = json */
/*   const { userId } = auth() */
/**/
/*   if (!userId) { */
/*     console.log('NO USERID') */
/*     return new Response('Unauthorized', { */
/*       status: 401 */
/*     }) */
/*   } */
/**/
/*   if (previewToken) { */
/*     configuration.apiKey = previewToken */
/*   } */
/**/
/*   const res = await openai.createChatCompletion({ */
/*     model: 'gpt-3.5-turbo', */
/*     messages, */
/*     temperature: 0.7, */
/*     stream: true */
/*   }) */
/**/
/*   const stream = OpenAIStream(res, { */
/*     async onCompletion(completion) { */
/*       const title = json.messages[0].content.substring(0, 100) */
/*       const id = json.id ?? nanoid() */
/*       const createdAt = Date.now() */
/*       const path = `/chat/${id}` */
/*       const payload = { */
/*         id, */
/*         title, */
/*         userId, */
/*         createdAt, */
/*         path, */
/*         messages: [ */
/*           ...messages, */
/*           { */
/*             content: completion, */
/*             role: 'assistant' */
/*           } */
/*         ] */
/*       } */
/*       await kv.hmset(`chat:${id}`, payload) */
/*       await kv.zadd(`user:chat:${userId}`, { */
/*         score: createdAt, */
/*         member: `chat:${id}` */
/*       }) */
/*     } */
/*   }) */
/**/
/*   return new StreamingTextResponse(stream) */
/* } */

import { HfInference } from '@huggingface/inference'
import { HuggingFaceStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'

// Create a new Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

// Build a prompt from the messages
// Note: this is specific to the OpenAssistant model we're using
// @see https://huggingface.co/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5#prompting
function buildOpenAssistantPrompt(
  messages: { content: string; role: 'system' | 'user' | 'assistant' }[]
) {
  return (
    messages
      .map(({ content, role }) => {
        if (role === 'user') {
          return `<|prompter|>${content}<|endoftext|>`
        } else {
          return `<|assistant|>${content}<|endoftext|>`
        }
      })
      .join('') + '<|assistant|>'
  )
}

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500 // Max 500 users per second
})

export async function POST(req: Request) {
  const exceeded = limiter.check(10, 'CACHE_TOKEN') // 10 requests per minute
  if (exceeded) {
    return NextResponse.json({ error: 'Rate Limit Exceeded' })
  }

  // Extract the `messages` from the body of the request
  const json = await req.json()
  const { messages } = json
  const { userId } = auth()

  // Initialize a text-generation stream using the Hugging Face Inference SDK
  const response = await Hf.textGenerationStream({
    model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
    inputs: buildOpenAssistantPrompt(messages),
    parameters: {
      max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false
    }
  })

  // Convert the async generator into a friendly text-stream
  /* const stream = HuggingFaceStream(response) */
  const stream = HuggingFaceStream(response, {
    onCompletion: async (completion: string) => {
      // This callback is called when the stream completes
      // You can use this to save the final completion to your database
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  // Respond with the stream, enabling the client to consume the response
  return new StreamingTextResponse(stream)
}
