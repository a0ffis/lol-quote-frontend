import { primaryApiClient } from "@/lib/axios-instance";
import axios, { AxiosError } from "axios";

export const getQuoteByCreator = async (options: { accessToken: string }) => {
  try {
    const response = await primaryApiClient.get("/chart/quotes-by-creator", {
      headers: {
        Authorization: `Bearer ${options?.accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.data?.message ||
          `Failed to fetch quote by creator with status code: ${response.status}`,
      );
    }

    console.log("Quote by creator fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching quote by creator:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        axiosError.message;
      throw new Error(errorMessage);
    } else {
      throw new Error(
        (error as Error).message ||
          "An unexpected error occurred while fetching the quote by creator.",
      );
    }
  }
};

export const getTopVotedQuotes = async (options: { accessToken: string }) => {
  try {
    const response = await primaryApiClient.get("/chart/top-voted-quotes", {
      headers: {
        Authorization: `Bearer ${options?.accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.data?.message ||
          `Failed to fetch top voted quotes with status code: ${response.status}`,
      );
    }

    console.log("Top voted quotes fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching top voted quotes:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        axiosError.message;
      throw new Error(errorMessage);
    } else {
      throw new Error(
        (error as Error).message ||
          "An unexpected error occurred while fetching the top voted quotes.",
      );
    }
  }
};
