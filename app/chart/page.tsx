"use client";
import Header from "@/components/layout/Header";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getQuoteByCreator, getTopVotedQuotes } from "@/services/chart-service";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, BarChart } from "recharts";

const quoteByCreatorChartConfig = {
  quoteCount: {
    label: "Number of Quotes",
    color: "hsl(var(--chart-1))",
  },
  username: {
    label: "Creator",
  },
} satisfies ChartConfig;

const topVotedQuotesChartConfig = {
  voteCount: {
    label: "Number of Votes",
    color: "hsl(var(--chart-2))",
  },
  content: {
    label: "Quote Content",
  },
} satisfies ChartConfig;

const Page = () => {
  const { data: session, status }: { data: any; status: string } = useSession();
  const router = useRouter();

  const {
    data: quoteByCreator,
    isLoading: isLoadingCreator,
    error: errorCreator,
  } = useQuery({
    queryKey: ["quote_by_creator"],
    queryFn: async () => {
      const data = await getQuoteByCreator({
        accessToken: session?.accessToken || "",
      });
      return data || [];
    },
    enabled: !!session?.accessToken,
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });

  // Fetch data for Top N Voted Quotes
  const {
    data: topVotedQuotes,
    isLoading: isLoadingTopVoted,
    error: errorTopVoted,
  } = useQuery({
    queryKey: ["top_voted_quotes"],
    queryFn: async () => {
      const data = await getTopVotedQuotes({
        accessToken: session?.accessToken || "",
      });
      return data || [];
    },
    enabled: !!session?.accessToken,
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });

  // Handle loading state for both queries
  if (status === "loading" || isLoadingCreator || isLoadingTopVoted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin size-5" />
      </div>
    );
  }

  // Handle authentication
  if (status !== "authenticated") {
    router.push("login");
    return null;
  }

  // Handle errors from queries
  if (errorCreator || errorTopVoted) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>
          Error loading chart data:{" "}
          {errorCreator?.message || errorTopVoted?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background relative z-10 flex min-h-svh flex-col">
      <Header hiddenSearch />
      <div className="3xl:fixed:px-0 px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Chart Summary</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chart: Quotes by Creator */}
          <Card>
            <CardHeader>
              <CardTitle>Quotes by Creator</CardTitle>
              <CardDescription>
                Number of quotes created by each user.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={quoteByCreatorChartConfig}
                className="min-h-[300px] w-full"
              >
                <BarChart accessibilityLayer data={quoteByCreator}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="username"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="capitalize"
                  />
                  <YAxis // Removed dataKey here
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="capitalize"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar
                    dataKey="quoteCount"
                    fill="var(--color-quoteCount)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart: Top N Voted Quotes */}
          <Card>
            <CardHeader>
              <CardTitle>Top Voted Quotes</CardTitle>
              <CardDescription>
                Top 10 quotes by number of votes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={topVotedQuotesChartConfig}
                className="min-h-[300px] w-full"
              >
                <BarChart accessibilityLayer data={topVotedQuotes}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="content"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="capitalize text-xs"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis // Removed dataKey here
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="capitalize"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar
                    dataKey="voteCount"
                    fill="var(--color-voteCount)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
