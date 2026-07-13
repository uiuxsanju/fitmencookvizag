export function Marquee() {
  const items = "BE CONSISTENT ✦ EAT CLEAN ✦ STAY STRONG ✦ HIGH PROTEIN ✦ MILLET BASED ✦ FAT-LOSS FRIENDLY ✦ HOME COOKED ✦ ";
  return (
    <div className="overflow-hidden bg-ink py-3 text-cream">
      <div className="flex w-max animate-[marq_26s_linear_infinite] whitespace-nowrap font-display text-sm tracking-wide">
        <span className="px-4">{items.repeat(3)}</span>
        <span className="px-4">{items.repeat(3)}</span>
      </div>
      <style>{`@keyframes marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
