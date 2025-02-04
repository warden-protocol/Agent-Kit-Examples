import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import * as fs from 'fs/promises';
import * as path from 'path';

export class PDFParser {
    private static model: OpenAI;

    private static getModel(): OpenAI {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY not found in environment variables');
        }
        
        if (!this.model) {
            this.model = new OpenAI({
                openAIApiKey: process.env.OPENAI_API_KEY,
                temperature: 0,
                modelName: "gpt-3.5-turbo-instruct"
            });
        }
        
        return this.model;
    }

    static async extractAmountFromPDF(pdfBuffer: Buffer): Promise<number | undefined> {
        // Extracts dollar amounts from PDF content using OpenAI
        // Returns the total amount found or undefined
        try {
            // Save buffer to temp file
            const tempPath = path.join(process.cwd(), 'temp.pdf');
            await fs.writeFile(tempPath, pdfBuffer);

            // Load PDF from temp file
            const loader = new PDFLoader(tempPath);
            const docs = await loader.load();

            // Clean up temp file
            await fs.unlink(tempPath);

            // Split text into chunks
            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200
            });
            const splits = await splitter.splitDocuments(docs);

            // Initialize model
            const model = this.getModel();

            // Process each chunk with OpenAI
            let totalAmount = 0;
            for (const doc of splits) {
                const response = await model.call(
                    `Extract any dollar amount from this text. Return ONLY the number, no symbols or text: ${doc.pageContent}`
                );
                
                // Clean the response - extract just numbers
                const numberMatch = response.match(/\d+/);
                if (numberMatch) {
                    const amount = parseFloat(numberMatch[0]);
                    if (!isNaN(amount)) {
                        totalAmount += amount;
                    }
                }
            }

            return totalAmount > 0 ? totalAmount : undefined;

        } catch (error) {
            console.error('Error parsing PDF:', error);
            return undefined;
        }
    }
} 