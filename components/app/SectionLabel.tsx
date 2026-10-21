export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center gap-1.5">
      <div className="h-[5px] w-[5px] bg-brand-red" />
      <div className="text-[11px] font-bold uppercase tracking-wider text-brand-text-secondary">
        {children}
      </div>
    </div>
  );
}
