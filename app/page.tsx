"use client";
import Header from "@/components/layout/Header";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import QuoteCard, { QuoteCardProps } from "@/components/quote-card";
import { useQuery } from "@tanstack/react-query";
import { getQuote } from "@/services/quote-service";
import { ChartArea, CloudOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status }: { data: any; status: string } = useSession();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at" | "votes">(
    "updated_at",
  );

  const {
    data: { data = [] } = {
      data: [],
    },
    refetch,
  } = useQuery({
    queryKey: ["quotes", debouncedSearchValue, sortBy],
    queryFn: async () =>
      await getQuote(
        {
          content: debouncedSearchValue,
          sortBy: sortBy,
        },
        { access_token: session?.accessToken || "" },
      ),
    refetchOnWindowFocus: false,
    enabled: !!session?.accessToken,
  });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin size-5" />
      </div>
    );
  }

  if (status !== "authenticated") {
    router.push("login");
    return null;
  }

  return (
    <div className="bg-background relative z-10 flex min-h-svh flex-col">
      {/* <pre>{JSON.stringify(searchValue, null, 2)}</pre> */}
      <Header
        refetch={refetch}
        searchValue={searchValue}
        handleSetSearchValue={setSearchValue}
      />
      <div className="flex items-center justify-between px-6 mt-8">
        <Select
          defaultValue="updated_at"
          onValueChange={(value) => {
            setSortBy(value as "created_at" | "updated_at");
          }}
        >
          <SelectTrigger className="w-[180px]" value={"updated_at"}>
            <SelectValue placeholder="เรียงลำดับ" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup defaultValue={"updated_at"}>
              <SelectItem value="updated_at">อัพเดตล่าสุด</SelectItem>
              <SelectItem value="created_at">วันที่สร้างล่าสุด</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          size="icon"
          variant="outline"
          className="cursor-pointer"
          onClick={() => router.push("/chart")}
        >
          <ChartArea className="size-5 cursor-pointer" />
        </Button>
      </div>
      <div className="3xl:fixed:px-0 px-6">
        {data.length === 0 && (
          <div className="flex items-center justify-center pt-24">
            <div className="text-center flex flex-col items-center">
              <CloudOff size={99} className="w-full max-w-xs" />
              <h1 className="text-2xl font-bold mb-4">No Quotes Found</h1>
              <p className="text-gray-500">Try searching for something else.</p>
            </div>
          </div>
        )}
        {data.length > 0 && (
          <div className="grid mt-8 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.map((quote: QuoteCardProps["quote"], index: number) => (
              <QuoteCard key={index} quote={quote} refetch={refetch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
