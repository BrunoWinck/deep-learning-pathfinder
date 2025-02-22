
import { test, expect } from '@playwright/test';

test('Learning flow scenario', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // 1. Create learning path and add content
  await page.getByRole('button', { name: 'Add Path' }).click();
  const lastPath = page.getByRole('button', { name: 'New Learning Path' }).last();
  await lastPath.click({ button: 'right' }); // Simulate long press
  await page.getByRole('textbox', { name: 'Path name' }).fill('AI Agent');
  await page.getByRole('button', { name: 'Save' }).click();
  
  await page.getByRole('button', { name: 'Add Section' }).click();
  const lastSection = page.getByRole('heading', { level: 4 }).last();
  await lastSection.click({ button: 'right' }); // Long press
  await page.getByRole('textbox', { name: 'Section name' }).fill('Overview');
  await page.getByRole('button', { name: 'Save' }).click();

  // Add step
  await page.getByRole('textbox', { name: 'New step' }).fill('Watch Introduction to AI Agents: https://youtube.com/watch?v=example');
  await page.getByRole('button', { name: 'Add' }).click();

  // 2. Simulate time passing (1 hour)
  // Note: This would require backend modification to support time manipulation

  // 3. Add learning statement for watched video
  await page.getByRole('combobox', { name: 'Statement type' }).selectOption('watched');
  await page.getByRole('textbox', { name: 'Resource title' }).fill('Introduction to AI Agents');
  await page.getByRole('textbox', { name: 'Statement content' }).fill('Completed the overview video about AI agents');
  await page.getByRole('button', { name: 'Add Statement' }).click();

  // 4. Simulate day passing
  // Similarly, would need backend support

  // 5. Verify AI chat message
  const aiMessage = page.getByRole('log', { name: 'AI message' })
    .filter({ hasText: 'Any ideas you remember from the video you watched yesterday?' });
  await expect(aiMessage).toBeVisible();

  // 6. Add retrieved statement
  await page.getByRole('combobox', { name: 'Statement type' }).selectOption('retrieved');
  await page.getByRole('textbox', { name: 'Resource title' }).fill('Reference: Introduction to AI Agents');
  await page.getByRole('textbox', { name: 'Statement content' })
    .fill('An agent is a system that perceives its environment through sensors and acts upon that environment through actuators');
  await page.getByRole('button', { name: 'Add Statement' }).click();

  // 7. Verify AI response
  const aiPrompt = page.getByRole('log', { name: 'AI message' })
    .filter({ hasText: 'only one? push harder and find at least 5 more ideas' });
  await expect(aiPrompt).toBeVisible();

  // 8. Add 4 more statements
  const additionalIdeas = [
    'Agents can be classified as simple reflex, model-based, goal-based, or utility-based',
    'Agents use machine learning to improve their decision-making over time',
    'The agent cycle consists of: Sense -> Think -> Act -> Learn',
    'Agents can work individually or in multi-agent systems'
  ];

  for (const idea of additionalIdeas) {
    await page.getByRole('combobox', { name: 'Statement type' }).selectOption('retrieved');
    await page.getByRole('textbox', { name: 'Resource title' }).fill('Reference: Introduction to AI Agents');
    await page.getByRole('textbox', { name: 'Statement content' }).fill(idea);
    await page.getByRole('button', { name: 'Add Statement' }).click();
  }

  // 9. Simulate hour passing
  // Would need backend support

  // 10. Verify AI prompt for one more
  const aiBudge = page.getByRole('log', { name: 'AI message' })
    .filter({ hasText: 'one more, scrap your memories' });
  await expect(aiBudge).toBeVisible();

  // 11. Add new watched statement
  await page.getByRole('combobox', { name: 'Statement type' }).selectOption('watched');
  await page.getByRole('textbox', { name: 'Resource title' }).fill('Advanced AI Agents Implementation');
  await page.getByRole('textbox', { name: 'Statement content' })
    .fill('Watched second video on practical implementation of AI agents');
  await page.getByRole('button', { name: 'Add Statement' }).click();

  // 12. Verify AI warning
  const aiWarning = page.getByRole('log', { name: 'AI message' })
    .filter({ hasText: 'consuming new material without having solidified the early ones is not good' });
  await expect(aiWarning).toBeVisible();
});
