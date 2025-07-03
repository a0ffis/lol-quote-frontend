"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bolt,
  Heart,
  Plus,
  Settings2,
  Star,
  StarHalf,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AnimatedNumbers from "react-animated-numbers";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useUpdateQuote, useVoteQuote } from "@/services/quote-service/hooks";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";

export type QuoteCardProps = {
  quote: {
    author: string;
    content: string;
    created_at: string;
    created_by_id: string | null;
    id: string;
    updated_at: string;
    voted_by: any[];
    has_voted: boolean;
    _count: { voted_by: number };
  };
  refetch?: () => void;
};

interface UpdateQuoteFormValues {
  quote: string;
  author: string;
}

const QuoteCard = (props: QuoteCardProps) => {
  const { quote, refetch } = props;
  const { mutate } = useVoteQuote();
  const { data: session } = useSession();

  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);

  const { mutate: updatMutate } = useUpdateQuote();

  const handleVoteClick = useCallback(() => {
    mutate(
      {
        body: { id: quote.id },
        options: { access_token: session?.accessToken || "" },
      },
      {
        onSuccess: () => {
          refetch?.();
        },
        onError: (error) => {
          console.error("Error voting quote:", error);
        },
      },
    );
  }, [mutate, quote.id, session?.accessToken, refetch]);

  const {
    register,
    formState: { errors },
    reset,
    getValues,
  } = useForm<UpdateQuoteFormValues>();

  const onSubmit = useCallback(() => {
    const values = getValues();
    if (!values.quote || !values.author) {
      console.error("Quote and author are required.");
      return;
    }

    updatMutate(
      {
        body: {
          id: quote.id,
          quote: values.quote,
          author: values.author,
        },
        options: { access_token: session?.accessToken || "" },
      },
      {
        onSuccess(data, variables, context) {
          console.log("Quote updated successfully:", data);
          setModalUpdateOpen(false);
          refetch?.();
        },
      },
    );
  }, [getValues, mutate, quote.id, session?.accessToken]);

  useEffect(() => {
    if (modalUpdateOpen) {
      reset({
        quote: quote.content,
        author: quote.author,
      });
    }
  }, [modalUpdateOpen, quote, reset]);

  return (
    <>
      <Card className="justify-between">
        <CardHeader>
          {" "}
          <CardTitle className="before:content-['```'] after:content-['```'] text-3xl font-kanit">
            {quote.content || ""}
          </CardTitle>
          <CardAction
            className={`${quote._count.voted_by > 0 || quote.created_by_id !== session?.user?.id ? "opacity-0 pointer-events-none" : "opacity-100"} transition-opacity duration-150 `}
          >
            <Dialog open={modalUpdateOpen} onOpenChange={setModalUpdateOpen}>
              <form>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                  >
                    <Settings2 className="size-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Update Quote</DialogTitle>
                    <DialogDescription>
                      Update your quote here. Click save when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1">Quote</Label>
                      <Input
                        {...register("quote", {
                          required: "Quote is required",
                        })}
                        id="quote"
                        name="quote"
                        placeholder="คงมีแต่พระที่ต้องการฉัน"
                      />{" "}
                      {errors.quote && (
                        <p className="text-red-500 text-sm">
                          {errors.quote.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username-1">Author</Label>
                      <Input
                        {...register("author", {
                          required: "Author is required",
                        })}
                        id="Author"
                        name="author"
                        placeholder="หลวงพี่จัสติน"
                      />
                      {errors.author && (
                        <p className="text-red-500 text-sm">
                          {errors.author.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className="cursor-pointer" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      className="cursor-pointer"
                      type="submit"
                      onClick={onSubmit}
                    >
                      Update
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex items-center justify-between">
          <p className="">- {quote.author}</p>
          <div className="flex items-center">
            <AnimatedNumbers
              transitions={() => ({
                type: "spring",
                duration: 0.15,
              })}
              className="font-kanit pr-1"
              animateToNumber={quote._count.voted_by || 0}
            />
            <Button
              size={"icon"}
              variant="ghost"
              className="cursor-pointer"
              onClick={handleVoteClick}
            >
              <Heart
                className={`size-6 ${quote.has_voted ? "fill-red-300" : ""}`}
              />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default QuoteCard;
