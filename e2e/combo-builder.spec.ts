import { test, expect } from '@playwright/test'

test.describe('Endfield Combo Builder', () => {
  test('should display the main page correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check title
    await expect(page.getByRole('heading', { name: /アークナイツ：エンドフィールド コンボビルダー/i })).toBeVisible()
    
    // Check control buttons
    await expect(page.getByRole('button', { name: '保存' })).toBeVisible()
    await expect(page.getByRole('button', { name: '読込' })).toBeVisible()
    await expect(page.getByRole('button', { name: '画像エクスポート' })).toBeVisible()
    await expect(page.getByRole('button', { name: '共有' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'クリア' })).toBeVisible()
    
    // Check character selection
    await expect(page.getByRole('heading', { name: 'チーム編成' })).toBeVisible()
    
    // Check timeline
    await expect(page.getByRole('heading', { name: 'コンボタイムライン' })).toBeVisible()
  })

  test('should allow selecting characters', async ({ page }) => {
    await page.goto('/')
    
    // Select first character
    const firstSelect = page.getByRole('combobox').first()
    await firstSelect.selectOption('1')
    
    // Verify character is displayed
    await expect(page.getByText('オペレーター1')).toBeVisible()
    
    // Verify timeline shows character
    const timeline = page.locator('#combo-timeline')
    await expect(timeline.getByText('オペレーター1')).toBeVisible()
    await expect(timeline.getByText('通常攻撃')).toBeVisible()
    await expect(timeline.getByText('戦技')).toBeVisible()
    await expect(timeline.getByText('連携技')).toBeVisible()
    await expect(timeline.getByText('必殺技')).toBeVisible()
  })

  test('should allow saving and loading combos', async ({ page }) => {
    await page.goto('/')
    
    // Set combo name
    await page.getByRole('textbox').fill('E2E Test Combo')
    
    // Select characters
    await page.getByRole('combobox').first().selectOption('1')
    await page.getByRole('combobox').nth(1).selectOption('2')
    
    // Save combo
    page.on('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: '保存' }).click()
    
    // Clear
    await page.getByRole('button', { name: 'クリア' }).click()
    
    // Verify cleared
    await expect(page.getByRole('textbox')).toHaveValue('新しいコンボ')
    
    // Load combo
    await page.getByRole('button', { name: '読込' }).click()
    await expect(page.getByText('E2E Test Combo')).toBeVisible()
    
    // Click load button in dialog
    await page.getByRole('button', { name: '読込' }).nth(1).click()
    
    // Verify loaded
    await expect(page.getByRole('textbox')).toHaveValue('E2E Test Combo')
    await expect(page.getByText('オペレーター1')).toBeVisible()
    await expect(page.getByText('オペレーター2')).toBeVisible()
  })

  test('should allow clearing combos', async ({ page }) => {
    await page.goto('/')
    
    // Select a character
    await page.getByRole('combobox').first().selectOption('1')
    await expect(page.getByText('オペレーター1')).toBeVisible()
    
    // Clear
    page.on('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: 'クリア' }).click()
    
    // Verify cleared
    await expect(page.getByText('オペレーター1')).not.toBeVisible()
  })
})
