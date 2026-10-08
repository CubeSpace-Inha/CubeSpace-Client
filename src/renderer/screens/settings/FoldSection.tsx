import { useState, type ReactNode } from "react";

type Props = { title: string; hint?: string; children: ReactNode };

// 제목을 눌러 접고 펴는 설정 칸(시안 setSec).
export function FoldSection({ title, hint, children }: Props) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button type="button" className={open ? "seth open" : "seth"} aria-expanded={open} onClick={() => setOpen(!open)}>
        {title}
        {hint && <em>{hint}</em>}
        <i aria-hidden="true">›</i>
      </button>
      {open && children}
    </div>
  );
}
