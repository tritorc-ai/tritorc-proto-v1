import { Skeleton } from "@/components/app/Skeleton";

export default function HomeLoading() {
  return (
    <div>
      <Skeleton className="h-[min(76svh,600px)] min-h-[470px] w-full rounded-none rounded-b-[36px]" />
      <div className="space-y-8 px-5 pt-8">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-[250px] w-full rounded-[22px]" />
        <Skeleton className="aspect-[3/4] w-[84%] rounded-[28px]" />
      </div>
    </div>
  );
}
