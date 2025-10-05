'use server';

/**
 * @fileOverview A proactive alert generator that uses an LLM to identify abnormal behavior and suggest solutions.
 *
 * - generateProactiveAlerts - A function that generates proactive alerts based on server status.
 * - GenerateProactiveAlertsInput - The input type for the generateProactiveAlerts function.
 * - GenerateProactiveAlertsOutput - The return type for the generateProactiveAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProactiveAlertsInputSchema = z.object({
  serverStatuses: z.record(z.string(), z.boolean()).describe('A record of server statuses, where the key is the server name and the value is a boolean indicating online status.'),
});
export type GenerateProactiveAlertsInput = z.infer<typeof GenerateProactiveAlertsInputSchema>;

const GenerateProactiveAlertsOutputSchema = z.object({
  alerts: z.array(z.string()).describe('An array of proactive alerts and recommendations based on abnormal server behavior.'),
});
export type GenerateProactiveAlertsOutput = z.infer<typeof GenerateProactiveAlertsOutputSchema>;

export async function generateProactiveAlerts(input: GenerateProactiveAlertsInput): Promise<GenerateProactiveAlertsOutput> {
  return generateProactiveAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProactiveAlertsPrompt',
  input: {schema: GenerateProactiveAlertsInputSchema},
  output: {schema: GenerateProactiveAlertsOutputSchema},
  prompt: `You are an AI assistant that analyzes server statuses and generates proactive alerts and recommendations to aid in quickly identifying and solving issues.

  Analyze the following server statuses:

  {{#each (keys serverStatuses)}}
    - {{this}}: {{../serverStatuses.[this]}}
  {{/each}}

  Generate a list of proactive alerts and recommendations based on any abnormal behavior or potential issues.
  Return the alerts in an array of strings.
  `,
});

const generateProactiveAlertsFlow = ai.defineFlow(
  {
    name: 'generateProactiveAlertsFlow',
    inputSchema: GenerateProactiveAlertsInputSchema,
    outputSchema: GenerateProactiveAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
