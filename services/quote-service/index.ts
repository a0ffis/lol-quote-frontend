import { primaryApiClient } from "@/lib/axios-instance";
import axios, { AxiosError } from "axios";

export const getQuote = async (query, options: { access_token: string }) => {
  try {
    const response = await primaryApiClient.get("/quote", {
      params: query,
      headers: {
        Authorization: `Bearer ${options?.access_token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.data?.message ||
          `Failed to fetch quote with status code: ${response.status}`,
      );
    }

    console.log("Quote fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching quote:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        axiosError.message;
      throw new Error(errorMessage);
    } else {
      throw new Error(
        (error as Error).message ||
          "An unexpected error occurred while fetching the quote.",
      );
    }
  }
};

export const postCreateQuote = async (
  data: { quote: string; author: string },
  options: { access_token: string },
) => {
  try {
    const response = await primaryApiClient.post("/quote", data, {
      headers: {
        Authorization: `Bearer ${options?.access_token}`,
      },
    });

    if (response.status !== 201) {
      throw new Error(
        response.data?.message ||
          `Failed to create quote with status code: ${response.status}`,
      );
    }

    console.log("Quote created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating quote:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        axiosError.message;
      throw new Error(errorMessage);
    } else {
      throw new Error(
        (error as Error).message ||
          "An unexpected error occurred while creating the quote.",
      );
    }
  }
};

export const patchVoteQuote = async (
  id: string,
  options: { access_token: string },
) => {
  try {
    const response = await primaryApiClient.patch(
      `/quote/vote/${id}`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${options?.access_token}`,
        },
      },
    );

    if (response.status !== 200) {
      throw new Error(
        response.data?.message ||
          `Failed to vote for quote with status code: ${response.status}`,
      );
    }

    console.log("Quote voted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error voting for quote:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        axiosError.message;
      throw new Error(errorMessage);
    } else {
      throw new Error(
        (error as Error).message ||
          "An unexpected error occurred while voting for the quote.",
      );
    }
  }
};

export const patchUpdateQuote = async (
  id: string,
  data: { quote: string; author: string },
  options: { access_token: string },
) => {
  try {
    const response = await primaryApiClient.patch(`/quote/${id}`, data, {
      headers: {
        Authorization: `Bearer ${options?.access_token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        response.data?.message ||
          `Failed to update quote with status code: ${response.status}`,
      );
    }

    console.log("Quote updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating quote:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        axiosError.message;
      throw new Error(errorMessage);
    } else {
      throw new Error(
        (error as Error).message ||
          "An unexpected error occurred while updating the quote.",
      );
    }
  }
};
