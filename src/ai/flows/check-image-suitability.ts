'use server';
/**
 * @fileOverview This file defines a Genkit flow for checking the suitability of an image for use in an ID card.
 *
 * - checkImageSuitability - A function that takes an image data URI and returns a suitability report.
 * - CheckImageSuitabilityInput - The input type for the checkImageSuitability function.
 * - CheckImageSuitabilityOutput - The return type for the checkImageSuitability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckImageSuitabilityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo to check for suitability, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
});
export type CheckImageSuitabilityInput = z.infer<typeof CheckImageSuitabilityInputSchema>;

const CheckImageSuitabilityOutputSchema = z.object({
  isSuitable: z.boolean().describe('Whether the image is suitable for an ID card.'),
  suitabilityReport: z.string().describe('A detailed report on the image suitability.'),
});
export type CheckImageSuitabilityOutput = z.infer<typeof CheckImageSuitabilityOutputSchema>;

export async function checkImageSuitability(input: CheckImageSuitabilityInput): Promise<CheckImageSuitabilityOutput> {
  return checkImageSuitabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkImageSuitabilityPrompt',
  input: {schema: CheckImageSuitabilityInputSchema},
  output: {schema: CheckImageSuitabilityOutputSchema},
  prompt: `You are an AI assistant specialized in evaluating the suitability of images for ID cards.\n\nYou will receive an image and must determine if it is suitable for use in an ID card. Consider factors such as face visibility, lighting conditions, image quality, and background appropriateness. Generate a detailed report explaining your assessment and provide a boolean value indicating overall suitability.\n\nImage: {{media url=photoDataUri}}\n\nRespond in JSON format:
{
  "isSuitable": true/false,
  "suitabilityReport": "Detailed report here"
}`,
});

const checkImageSuitabilityFlow = ai.defineFlow(
  {
    name: 'checkImageSuitabilityFlow',
    inputSchema: CheckImageSuitabilityInputSchema,
    outputSchema: CheckImageSuitabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
