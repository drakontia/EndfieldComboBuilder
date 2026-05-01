import { test, expect } from '@playwright/test'
import { ComboBuilderPage } from './pages/ComboBuilderPage'

test.describe('URL 共有機能', () => {
  test('共有 URL を生成してクリップボードにコピーできる', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const builder = new ComboBuilderPage(page)
    await builder.goto()

    await builder.setComboName('URL 共有テスト')
    await builder.selectCharacter(0, 'レーヴァテイン')

    await builder.shareButton.click()

    // クリップボードの URL を取得して検証
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toMatch(/^https?:\/\//)
    expect(clipboardText).toContain('combo=')
  })

  test('共有 URL でページを開くとコンボが復元される', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const builder = new ComboBuilderPage(page)
    await builder.goto()

    // コンボを作成して共有 URL を生成
    await builder.setComboName('URL 復元テスト')
    await builder.selectCharacter(0, 'レーヴァテイン')
    await builder.selectCharacter(1, 'ギルベルタ')

    await builder.shareButton.click()
    const sharedUrl = await page.evaluate(() => navigator.clipboard.readText())
    console.log('Shared URL:', sharedUrl)

    // 別ページで共有 URL を開く
    const newPage = await context.newPage()
    
    // Add listener for console messages
    newPage.on('console', msg => console.log('PAGE LOG:', msg.text()))
    
    await newPage.goto(sharedUrl)
    await newPage.waitForLoadState('networkidle')
    
    // Wait for hydration
    await expect(newPage.getByRole('button', { name: /削除モード/ })).toBeVisible()
    
    // Log what's in the URL
    const urlParams = await newPage.evaluate(() => {
      const params = new URLSearchParams(window.location.search)
      return {
        hasCombo: params.has('combo'),
        comboLength: params.get('combo')?.length || 0
      }
    })
    console.log('URL params:', urlParams)
    
    // Give more time for the useEffect to run and update the store
    await newPage.waitForTimeout(2000)
    
    // Check the actual input value and store state
    const comboNameInput = newPage.getByRole('textbox')
    const actualValue = await comboNameInput.inputValue()
    console.log('Actual combo name value:', JSON.stringify(actualValue))
    
    const storeState = await newPage.evaluate(() => {
      // Try to access window.__comboStore if it exists
      return window.location.search
    })
    console.log('URL search:', storeState)

    const restoredBuilder = new ComboBuilderPage(newPage)

    // コンボ名とキャラクターが復元されていることを確認
    await expect(restoredBuilder.characterSlot(0).getByText('レーヴァテイン')).toBeVisible()
    await expect(restoredBuilder.characterSlot(1).getByText('ギルベルタ')).toBeVisible()
    
    // Now check the combo name
    await expect(comboNameInput).toHaveValue('URL 復元テスト')

    await newPage.close()
  })
})
