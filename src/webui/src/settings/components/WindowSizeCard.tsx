// WindowSizeCard - 弹出窗口（划词结果窗）宽高设置表单
// 调整后点「应用」写回宿主配置；下次弹出结果窗按此尺寸开窗。
import { useEffect, useRef, useState } from 'react'

interface Props {
  width: number
  height: number
  saveDone: number // >0 表示刚保存成功（触发按钮 done 态）
  onWidthChange: (v: number) => void
  onHeightChange: (v: number) => void
  onSave: (w: number, h: number) => void
}

const MIN_W = 300
const MIN_H = 240
const MAX = 4000

export default function WindowSizeCard(p: Props) {
  const [saved, setSaved] = useState(false)
  const [bad, setBad] = useState(false)
  const wRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!p.saveDone) return
    setSaved(true)
    const t = setTimeout(() => setSaved(false), 1400)
    return () => clearTimeout(t)
  }, [p.saveDone])

  const submit = () => {
    const w = Math.round(p.width)
    const h = Math.round(p.height)
    if (!Number.isFinite(w) || !Number.isFinite(h) || w < MIN_W || h < MIN_H || w > MAX || h > MAX) {
      setBad(true)
      setTimeout(() => setBad(false), 600)
      wRef.current?.focus()
      return
    }
    p.onSave(w, h)
  }

  return (
    <>
      <div className="sizepair">
        <div className="field">
          <label>宽度</label>
          <div className="inrow">
            <input
              ref={wRef}
              className={bad ? 'bad' : ''}
              type="number"
              min={MIN_W}
              max={MAX}
              value={p.width}
              onChange={(e) => p.onWidthChange(parseInt(e.target.value, 10) || 0)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>
        </div>
        <div className="field">
          <label>高度</label>
          <div className="inrow">
            <input
              className={bad ? 'bad' : ''}
              type="number"
              min={MIN_H}
              max={MAX}
              value={p.height}
              onChange={(e) => p.onHeightChange(parseInt(e.target.value, 10) || 0)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>
        </div>
      </div>
      <div className="note">
        <span>适用于划词翻译弹出窗口，单位为像素；下次打开生效。</span>
      </div>
      <div className="kfoot">
        <button className={'btn pri' + (saved ? ' done' : '')} onClick={submit}>
          {saved ? '✓ 已保存' : '应用'}
        </button>
      </div>
    </>
  )
}
