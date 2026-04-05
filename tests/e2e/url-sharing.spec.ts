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

    // 別ページで共有 URL を開く
    const newPage = await context.newPage()
    await newPage.goto(sharedUrl)
    await newPage.waitForLoadState('networkidle')

    const restoredBuilder = new ComboBuilderPage(newPage)

    // コンボ名とキャラクターが復元されていることを確認
    await expect(restoredBuilder.comboNameInput).toHaveValue('URL 復元テスト')
    await expect(restoredBuilder.characterSlot(0).getByText('レーヴァテイン')).toBeVisible()
    await expect(restoredBuilder.characterSlot(1).getByText('ギルベルタ')).toBeVisible()

    await newPage.close()
  })
})
