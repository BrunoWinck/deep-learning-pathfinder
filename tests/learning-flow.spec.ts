
import { test, expect } from '@playwright/test';

test('Learning flow scenario', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // 1. Create learning path and add content
  await page.getByText('Add Path').click();
  const lastPath = page.locator('.learning-statements-container button').last();
  await lastPath.click({ button: 'right' }); // Simulate long press
  await page.fill('input[type="text"]', 'AI Agent');
  await page.getByText('Save').click();
  
  await page.getByText('Add Section').click();
  const lastSection = page.locator('.bg-background').last();
  await lastSection.locator('h4').click({ button: 'right' }); // Long press
  await page.fill('input[type="text"]', 'Overview');
  await page.getByText('Save').click();

  // Add step
  await page.fill('input[placeholder="New step..."]', 'Watch Introduction to AI Agents: https://youtube.com/watch?v=example');
  await page.getByText('Add').click();

  // 2. Simulate time passing (1 hour)
  // Note: This would require backend modification to support time manipulation
  // For testing purposes, we'll continue with the flow

  // 3. Add learning statement for watched video
  await page.fill('select[name="verb"]', 'watched');
  await page.fill('input[placeholder="Resource title or link"]', 'Introduction to AI Agents');
  await page.fill('textarea', 'Completed the overview video about AI agents');
  await page.getByRole('button', { name: 'Add Statement' }).click();

  // 4. Simulate day passing
  // Similarly, would need backend support

  // 5. Verify AI chat message
  const aiMessage = await page.locator('.chat-message').filter({ hasText: 'Any ideas you remember from the video you watched yesterday?' });
  expect(aiMessage).toBeVisible();

  // 6. Add retrieved statement
  await page.fill('select[name="verb"]', 'retrieved');
  await page.fill('input[placeholder="Resource title or link"]', 'Reference: Introduction to AI Agents');
  await page.fill('textarea', 'An agent is a system that perceives its environment through sensors and acts upon that environment through actuators');
  await page.getByRole('button', { name: 'Add Statement' }).click();

  // 7. Verify AI response
  const aiPrompt = await page.locator('.chat-message').filter({ hasText: 'only one? push harder and find at least 5 more ideas' });
  expect(aiPrompt).toBeVisible();

  // 8. Add 4 more statements
  const additionalIdeas = [
    'Agents can be classified as simple reflex, model-based, goal-based, or utility-based',
    'Agents use machine learning to improve their decision-making over time',
    'The agent cycle consists of: Sense -> Think -> Act -> Learn',
    'Agents can work individually or in multi-agent systems'
  ];

  for (const idea of additionalIdeas) {
    await page.fill('select[name="verb"]', 'retrieved');
    await page.fill('input[placeholder="Resource title or link"]', 'Reference: Introduction to AI Agents');
    await page.fill('textarea', idea);
    await page.getByRole('button', { name: 'Add Statement' }).click();
  }

  // 9. Simulate hour passing
  // Would need backend support

  // 10. Verify AI prompt for one more
  const aiBudge = await page.locator('.chat-message').filter({ hasText: 'one more, scrap your memories' });
  expect(aiBudge).toBeVisible();

  // 11. Add new watched statement
  await page.fill('select[name="verb"]', 'watched');
  await page.fill('input[placeholder="Resource title or link"]', 'Advanced AI Agents Implementation');
  await page.fill('textarea', 'Watched second video on practical implementation of AI agents');
  await page.getByRole('button', { name: 'Add Statement' }).click();

  // 12. Verify AI warning
  const aiWarning = await page.locator('.chat-message').filter({ 
    hasText: 'consuming new material without having solidified the early ones is not good' 
  });
  expect(aiWarning).toBeVisible();
});
