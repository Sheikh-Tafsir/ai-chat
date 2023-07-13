/* import { createWorker } from 'tesseract.js' */
/**/
/* export async function GET() { */
/*   const worker = await createWorker({ */
/*     logger: m => console.log(m) */
/*   }) */
/**/
/*   console.log('RUNNING TESS') */
/*   await worker.loadLanguage('eng') */
/*   await worker.initialize('eng') */
/*   const { */
/*     data: { text } */
/*   } = await worker.recognize( */
/*     'https://tesseract.projectnaptha.com/img/eng_bw.png' */
/*   ) */
/*   console.log(text) */
/*   await worker.terminate() */
/* } */

export async function GET() {
  return new Response('ALL GOOd')
}
