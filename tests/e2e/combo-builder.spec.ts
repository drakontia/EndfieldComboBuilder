import { test, expect } from '@playwright/test'

test.describe('Endfield Combo Builder', () => {
  test('should display the main page correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check title
    await expect(page.getByRole('heading', { name: /アークナイツ：エンドフィールド コンボビルダー/i })).toBeVisible()
    
    // Check control buttons
    await expect(page.getByRole('button', { name: '削除モード: OFF' })).toBeVisible()
    await expect(page.getByRole('button', { name: '保存' })).toBeVisible()
    await expect(page.getByRole('button', { name: '読込' })).toBeVisible()
    await expect(page.getByRole('button', { name: '画像エクスポート' })).toBeVisible()
    await expect(page.getByRole('button', { name: '共有' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'クリア' })).toBeVisible()

    // Check timeline settings and selection button
    await expect(page.getByText('タイムライン設定')).toBeVisible()
    await expect(page.getByRole('button', { name: '選択...' }).first()).toBeVisible()

    // Check timeline container
    await expect(page.locator('#combo-timeline')).toBeVisible()
  })

  test('should allow selecting characters', async ({ page }) => {
    await page.goto('/')
    const dialog = page.getByRole('dialog', { name: 'オペレーター選択' })
    const selectCharacter = async (slotIndex: number, name: string) => {
      const slotButton = page.getByTestId(`character-slot-${slotIndex}`)
      await expect(slotButton).toBeVisible()
      await slotButton.click({ force: true })
      await expect(dialog).toBeVisible()
      await dialog.getByRole('button', { name: new RegExp(name) }).first().click({ force: true })
      await expect(dialog).toBeHidden()
    }
    
    // Select first character
    await selectCharacter(0, 'レーヴァテイン')
    
    // Verify character is displayed
    await expect(
      page.getByTestId('character-slot-0').getByText('レーヴァテイン')
    ).toBeVisible()
    
    // Verify timeline shows character
    const timeline = page.locator('#combo-timeline')
    await expect(timeline.getByText('通常攻撃')).toBeVisible()
    await expect(timeline.getByText('戦技')).toBeVisible()
    await expect(timeline.getByText('連携技')).toBeVisible()
    await expect(timeline.getByText('必殺技')).toBeVisible()
  })

  test('should allow saving and loading combos', async ({ page }) => {
    await page.goto('/')
    const dialog = page.getByRole('dialog', { name: 'オペレーター選択' })
    const selectCharacter = async (slotIndex: number, name: string) => {
      const slotButton = page.getByTestId(`character-slot-${slotIndex}`)
      await expect(slotButton).toBeVisible()
      await slotButton.click({ force: true })
      await expect(dialog).toBeVisible()
      await dialog.getByRole('button', { name: new RegExp(name) }).first().click({ force: true })
      await expect(dialog).toBeHidden()
    }
    
    // Set combo name
    await page.getByRole('textbox').click()
    await page.keyboard.press('Control+A')
    await page.keyboard.type('E2E Test Combo')
    
    // Select characters
    await selectCharacter(0, 'レーヴァテイン')
    await selectCharacter(1, 'ギルベルタ')
    
    // Save combo
    page.on('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: '保存' }).click()
    
    // Clear
    await page.getByRole('button', { name: 'クリア' }).click()
    
    // Verify cleared
    await expect(page.getByRole('textbox')).toHaveValue('コンボ名を入力...')
    
    // Load combo
    await page.getByRole('button', { name: '読込' }).click()
    await expect(page.getByText('E2E Test Combo')).toBeVisible()
    
    // Click load button in dialog
    await page.getByRole('button', { name: '読込' }).nth(1).click()
    
    // Verify loaded
    await expect(page.getByRole('textbox')).toHaveValue('E2E Test Combo')
    await expect(
      page.getByTestId('character-slot-0').getByText('レーヴァテイン')
    ).toBeVisible()
    await expect(
      page.getByTestId('character-slot-1').getByText('ギルベルタ')
    ).toBeVisible()
  })

  test('should allow clearing combos', async ({ page }) => {
    await page.goto('/')
    const dialog = page.getByRole('dialog', { name: 'オペレーター選択' })
    const selectCharacter = async (slotIndex: number, name: string) => {
      const slotButton = page.getByTestId(`character-slot-${slotIndex}`)
      await expect(slotButton).toBeVisible()
      await slotButton.click({ force: true })
      await expect(dialog).toBeVisible()
      await dialog.getByRole('button', { name: new RegExp(name) }).first().click({ force: true })
      await expect(dialog).toBeHidden()
    }
    
    // Select a character
    await selectCharacter(0, 'レーヴァテイン')
    await expect(
      page.getByTestId('character-slot-0').getByText('レーヴァテイン')
    ).toBeVisible()
    
    // Clear
    page.on('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: 'クリア' }).click()
    
    // Verify cleared
    await expect(
      page.getByTestId('character-slot-0').getByText('レーヴァテイン')
    ).toHaveCount(0)
  })
})
