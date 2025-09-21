import { ReactNode } from "react";
import { useAtom } from "jotai";
import { paneStateAtom } from "@/store/ui";
import { PaneToggle } from "@/components/game/PaneToggle";

interface CollapsibleGameLayoutProps {
  header: ReactNode;
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
  bottomPanel: ReactNode;
  children?: ReactNode;
}

export function CollapsibleGameLayout({
  header,
  leftPanel,
  centerPanel,
  rightPanel,
  bottomPanel,
  children,
}: CollapsibleGameLayoutProps) {
  const [paneState] = useAtom(paneStateAtom);

  const gridStyles = {
    gridTemplateColumns: `${paneState.left ? "240px" : "48px"} 1fr ${
      paneState.right ? "300px" : "48px"
    }`,
    gridTemplateRows: `72px 1fr ${paneState.bottom ? "320px" : "52px"}`,
  };

  const panelBaseClass =
    "relative border border-cyan-400/30 bg-slate-950/70 shadow-[0_0_55px_rgba(15,118,110,0.35)] transition-all duration-300 ease-in-out overflow-hidden backdrop-blur-xl";

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/title_image.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.45)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-950/85 to-black/95"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen items-stretch justify-center px-4 py-6 md:px-10 md:py-10">
        <div
          className="grid h-full w-full max-w-[1600px] gap-4 overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-950/60 shadow-[0_40px_120px_rgba(12,74,110,0.55)] transition-all duration-500 ease-in-out"
          style={gridStyles}
        >
          {/* 上部ヘッダー - 全幅に跨る */}
          <header
            className={`${panelBaseClass} col-span-3 flex items-center justify-between border-b border-cyan-400/30 px-6 py-4 shadow-[0_12px_35px_rgba(56,189,248,0.25)]`}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400/60 via-emerald-300/50 to-sky-500/60 opacity-70" />
            <div className="relative z-10 w-full">{header}</div>
          </header>

          {/* 左ペイン */}
          <aside
            className={`${panelBaseClass} ${
              paneState.left ? "p-4 pt-10" : "p-0"
            }`}
          >
            {/* 左ペインの展開縮小ボタン */}
            <div className="absolute top-3 right-3 z-20">
              <PaneToggle pane="left" position="inline" />
            </div>

            <div
              className={`h-full overflow-y-auto transition-opacity duration-300 ${
                paneState.left ? "opacity-100" : "opacity-0"
              }`}
            >
              {paneState.left && leftPanel}
            </div>
          </aside>

          {/* 中央ペイン - 常に表示 */}
          <section
            className={`${panelBaseClass} border border-cyan-300/20 px-6 py-5`}
          >
            <div className="h-full overflow-y-auto pr-1">{centerPanel}</div>
          </section>

          {/* 右ペイン */}
          <aside
            className={`${panelBaseClass} ${
              paneState.right ? "p-4" : "p-0"
            }`}
          >
            {/* 右ペインの展開縮小ボタン */}
            <div className="absolute top-1/2 left-3 z-20 -translate-y-1/2">
              <PaneToggle pane="right" position="inline" />
            </div>

            <div
              className={`h-full overflow-y-auto transition-opacity duration-300 ${
                paneState.right ? "opacity-100" : "opacity-0"
              }`}
            >
              {paneState.right && rightPanel}
            </div>
          </aside>

          {/* 下部ペイン - 全幅に跨る */}
          <footer
            className={`${panelBaseClass} col-span-3 ${
              paneState.bottom ? "p-4" : "p-2"
            }`}
          >
            {/* 下部ペインの展開縮小ボタン */}
            <div className="absolute top-3 left-1/2 z-20 -translate-x-1/2">
              <PaneToggle pane="bottom" position="inline" />
            </div>

            <div
              className={`h-full transition-opacity duration-300 ${
                paneState.bottom ? "opacity-100" : "opacity-70"
              }`}
            >
              {bottomPanel}
            </div>
          </footer>

          {/* モーダルやオーバーレイ */}
          {children}
        </div>
      </div>
    </div>
  );
}
