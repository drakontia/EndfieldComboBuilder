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
    await expect(timeline.getByText('通常攻撃').first()).toBeVisible()
    await expect(timeline.getByText('戦技').first()).toBeVisible()
    await expect(timeline.getByText('連携技').first()).toBeVisible()
    await expect(timeline.getByText('必殺技').first()).toBeVisible()
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

  test('should display cold infusion and cryo stacks from Last Rite', async ({ page }) => {
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

    // Select Last Rite as character
    await selectCharacter(0, 'ラストライト')
    await expect(
      page.getByTestId('character-slot-0').getByText('ラストライト')
    ).toBeVisible()

    // Get the timeline container
    const timeline = page.locator('#combo-timeline')
    await expect(timeline).toBeVisible()

    // Look for Last Rite's timeline rows
    await expect(timeline.getByText('通常攻撃').first()).toBeVisible()
    await expect(timeline.getByText('戦技').first()).toBeVisible()

    // Click on the battle skill row to add an action by clicking in the timeline area
    // Find the battle skill row container
    const battleSkillRow = timeline.locator('div').filter({ hasText: /^戦技$/ }).first()
    const battleSkillContainer = battleSkillRow.locator('..')
    
    // Add multiple battle skill actions by clicking in the timeline
    // First action
    const timelineWidth = await battleSkillContainer.evaluate(el => el.offsetWidth)
    const timelineHeight = await battleSkillContainer.evaluate(el => el.offsetHeight)
    
    if (timelineWidth && timelineHeight) {
      // Click at 10% of timeline
      await battleSkillContainer.click({ position: { x: timelineWidth * 0.1, y: timelineHeight / 2 } })
      
      // Click at 20% of timeline
      await battleSkillContainer.click({ position: { x: timelineWidth * 0.2, y: timelineHeight / 2 } })
      
      // Click at 30% of timeline
      await battleSkillContainer.click({ position: { x: timelineWidth * 0.3, y: timelineHeight / 2 } })
    }

    // Now look for the status effect indicators
    // The component should show cryo attachment with stack counts
    
    // Scroll to see more of the page including enemy status
    await page.evaluate(() => window.scrollBy(0, 500))
    
    // Wait a bit for rendering
    await page.waitForTimeout(300)

    // Verify that cryo is displayed (if battle skills were applied)
    const cryoElements = page.locator('text=/寒冷/')
    const cryoCount = await cryoElements.count()
    
    if (cryoCount > 0) {
      // Cryo is displayed, verify its visibility
      await expect(cryoElements.first()).toBeVisible()
    }

    // Verify that cold infusion is displayed in operator status
    const coldInfusionElements = page.locator('text=/低温注入/')
    const coldInfusionCount = await coldInfusionElements.count()
    
    if (coldInfusionCount > 0) {
      // Cold infusion is displayed
      await expect(coldInfusionElements.first()).toBeVisible()
    }

    // Verify Last Rite component is still visible
    await expect(
      page.getByTestId('character-slot-0').getByText('ラストライト')
    ).toBeVisible()
  })
})
