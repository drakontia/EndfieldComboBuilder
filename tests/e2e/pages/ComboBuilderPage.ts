import { type Page, type Locator, expect } from '@playwright/test'

/**
 * ComboBuilder アプリ全体の Page Object Model
 * テストコードの重複を排除し、セレクターを一箇所に集約する
 */
export class ComboBuilderPage {
  readonly page: Page

  // ---- Control Panel ----
  readonly comboNameInput: Locator
  readonly saveButton: Locator
  readonly loadButton: Locator
  readonly exportButton: Locator
  readonly shareButton: Locator
  readonly clearButton: Locator
  readonly deleteModeButton: Locator

  // ---- Timeline ----
  readonly timeline: Locator

  // ---- Dialogs ----
  readonly operatorSelectDialog: Locator
  readonly loadDialog: Locator

  constructor(page: Page) {
    this.page = page

    this.comboNameInput = page.getByRole('textbox')
    this.saveButton = page.getByRole('button', { name: '保存' })
    this.loadButton = page.getByRole('button', { name: '読込' }).first()
    this.exportButton = page.getByRole('button', { name: '画像エクスポート' })
    this.shareButton = page.getByRole('button', { name: '共有' })
    this.clearButton = page.getByRole('button', { name: 'クリア' })
    this.deleteModeButton = page.getByRole('button', { name: /削除モード/ })

    this.timeline = page.locator('#combo-timeline')

    this.operatorSelectDialog = page.getByRole('dialog', { name: 'オペレーター選択' })
    this.loadDialog = page.getByRole('dialog')
  }

  async goto() {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')
    
    // Wait for the delete mode button to be visible (indicates component is fully hydrated)
    await expect(this.deleteModeButton).toBeVisible()
  }

  /** キャラクタースロットを取得 */
  characterSlot(index: number): Locator {
    return this.page.getByTestId(`character-slot-${index}`)
  }

  /** 指定スロットにオペレーターを選択する */
  async selectCharacter(slotIndex: number, name: string) {
    // Click the "変更" button to open the character selector
    const changeButtons = this.page.getByRole('button', { name: '変更' })
    const changeButton = changeButtons.nth(slotIndex)
    await expect(changeButton).toBeVisible()
    await changeButton.click()
    
    // Wait for dialog title to appear
    await expect(this.page.getByText('オペレーター選択')).toBeVisible({ timeout: 5000 })
    
    // Find the character button and click it
    await this.page
      .getByRole('button', { name: new RegExp(name) })
      .first()
      .click()
    
    // Wait for dialog to disappear and character is selected
    await expect(this.page.getByText('オペレーター選択')).toBeHidden()
    await expect(this.characterSlot(slotIndex).getByText(name)).toBeVisible()
  }

  /** コンボ名を設定する */
  async setComboName(name: string) {
    await this.comboNameInput.click()
    await this.page.keyboard.press('Control+A')
    await this.page.keyboard.type(name)
  }

  /** 保存ダイアログを受け入れつつ保存する */
  async saveCombo() {
    this.page.once('dialog', (dialog) => dialog.accept())
    await this.saveButton.click()
  }

  /** クリアダイアログを受け入れつつクリアする */
  async clearCombo() {
    this.page.once('dialog', (dialog) => dialog.accept())
    await this.clearButton.click()
  }

  /** 読込ダイアログからコンボを選択して読み込む */
  async loadCombo(name: string) {
    await this.loadButton.click()
    await expect(this.page.getByText(name)).toBeVisible()
    // ダイアログ内の「読込」ボタン（2番目）をクリック
    await this.page.getByRole('button', { name: '読込' }).nth(1).click()
  }

  /** タイムライン上の指定スキルレーンに対してアクションを追加する（位置: 0.0〜1.0） */
  async addActionToLane(laneLabel: string, positionRatio: number) {
    const laneRow = this.timeline
      .locator('div')
      .filter({ hasText: new RegExp(`^${laneLabel}$`) })
      .first()
    const container = laneRow.locator('..')
    const width = await container.evaluate((el) => (el as HTMLElement).offsetWidth)
    const height = await container.evaluate((el) => (el as HTMLElement).offsetHeight)
    await container.click({
      position: { x: width * positionRatio, y: height / 2 },
    })
  }

  /** ページ下部までスクロール */
  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await this.page.waitForLoadState('domcontentloaded')
  }
}
