import { test, expect } from '@playwright/test'
import { ComboBuilderPage } from './pages/ComboBuilderPage'

test.describe('落下攻撃タイムライン', () => {
  test('キャラクター選択後に落下攻撃行が表示される', async ({ page }) => {
    const builder = new ComboBuilderPage(page)
    await builder.goto()

    await builder.selectCharacter(0, 'レーヴァテイン')

    await expect(builder.timeline.getByText('通常攻撃').first()).toBeVisible()
    await expect(builder.timeline.getByText('落下攻撃').first()).toBeVisible()
  })

  test('落下攻撃行をクリックするとアクションが追加される', async ({ page }) => {
    const builder = new ComboBuilderPage(page)
    await builder.goto()

    await builder.selectCharacter(0, 'レーヴァテイン')

    // 落下攻撃行の 20% 地点にアクションを追加
    await builder.addActionToLane('落下攻撃', 0.2)

    // アクションが追加されたことをタイムライン内の要素で確認
    const plungeActions = builder.timeline.locator('[data-action-id]')
    await expect(plungeActions).toHaveCount(1)
  })

  test('通常攻撃と落下攻撃が同タイミングに重なるとアラートが表示される', async ({ page }) => {
    const builder = new ComboBuilderPage(page)
    await builder.goto()

    await builder.selectCharacter(0, 'レーヴァテイン')

    // 通常攻撃行の 5% 地点にアクションを追加
    await builder.addActionToLane('通常攻撃', 0.05)
    await expect(builder.timeline.locator('[data-action-id]')).toHaveCount(1)

    // 同タイミング付近に落下攻撃を追加 → 重複アラートが出ることを確認
    let alertTriggered = false
    page.once('dialog', async (dialog) => {
      alertTriggered = true
      expect(dialog.message()).toContain('通常攻撃または落下攻撃が重なっています')
      await dialog.accept()
    })

    await builder.addActionToLane('落下攻撃', 0.05)
    await page.waitForTimeout(300)

    expect(alertTriggered).toBe(true)
    // アクション数が増えていないことを確認
    await expect(builder.timeline.locator('[data-action-id]')).toHaveCount(1)
  })

  test('落下攻撃アクションを削除モードで削除できる', async ({ page }) => {
    const builder = new ComboBuilderPage(page)
    await builder.goto()

    await builder.selectCharacter(0, 'レーヴァテイン')

    // 落下攻撃を追加
    await builder.addActionToLane('落下攻撃', 0.3)
    await expect(builder.timeline.locator('[data-action-id]')).toHaveCount(1)

    // 削除モードを有効化
    await builder.deleteModeButton.click()
    await expect(builder.deleteModeButton).toContainText('ON')

    // アクションをクリックして削除（dnd-kit が aria-disabled を付与するため force: true）
    await builder.timeline.locator('[data-action-id]').first().click({ force: true })

    await expect(builder.timeline.locator('[data-action-id]')).toHaveCount(0)
  })

  test('通常攻撃と落下攻撃を異なるタイミングで共存させられる', async ({ page }) => {
    const builder = new ComboBuilderPage(page)
    await builder.goto()

    await builder.selectCharacter(0, 'レーヴァテイン')

    // 通常攻撃を 10% 付近に追加
    await builder.addActionToLane('通常攻撃', 0.1)

    // 落下攻撃を 50% 付近に追加（重ならない位置）
    await builder.addActionToLane('落下攻撃', 0.5)

    // 両方のアクションが存在することを確認
    await expect(builder.timeline.locator('[data-action-id]')).toHaveCount(2)
  })
})
