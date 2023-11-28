import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf"

export const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: "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", // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
})

// console.log(embeddings)