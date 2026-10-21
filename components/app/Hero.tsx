import Image from "next/image";

export function Hero({
  quote,
  since,
  imageUrl,
}: {
  quote: string;
  since: string;
  imageUrl?: string;
}) {
  return (
    <div className="relative mb-8 h-[300px] overflow-hidden bg-[repeating-linear-gradient(115deg,#4a4f55_0px,#4a4f55_16px,#3d4247_16px,#3d4247_32px)]">
      {imageUrl ? (
        <Image src={imageUrl} alt="" fill priority className="object-cover" sizes="100vw" />
      ) : (
        <div className="absolute right-4 top-3 z-[2] rounded-sm bg-black/35 px-1.5 py-0.5 font-mono text-[9px] font-medium text-white/50">
          PHOTO: EQUIPMENT IN THE FIELD
        </div>
      )}
      <div className="absolute inset-0 [background-image:linear-gradient(0deg,rgba(8,8,8,.96)_0%,rgba(8,8,8,.65)_50%,rgba(8,8,8,.3)_100%)]" />
      <div className="absolute right-[-10px] top-[-30px] z-[1] font-sans text-[170px] font-extrabold leading-none tracking-[-0.04em] text-white/5">
        35+
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-brand-red to-brand-red-bright" />
      <div className="absolute inset-x-5 bottom-6 z-[2] flex items-start gap-3.5">
        <div className="w-1 shrink-0 self-stretch rounded-sm bg-brand-red" />
        <div>
          <div className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-red-bright">
            {since}
          </div>
          <div className="text-[24px] font-extrabold leading-[1.28] tracking-[-0.015em] text-white">
            {quote}
          </div>
        </div>
      </div>
    </div>
  );
}
