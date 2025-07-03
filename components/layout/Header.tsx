import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Castle, Plus, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateQuote } from "@/services/quote-service/hooks";

type Props = {
  searchValue?: string;
  handleSetSearchValue?: (value: string) => void;
  refetch?: () => void;
  hiddenSearch?: boolean;
};

interface CreateQuoteFormValues {
  quote: string;
  author: string;
}

const Header = (props: Props) => {
  const {
    refetch,
    searchValue,
    handleSetSearchValue,
    hiddenSearch = false,
  } = props;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  const { mutate } = useCreateQuote();

  const {
    register,
    formState: { errors },
    reset,
    getValues,
  } = useForm<CreateQuoteFormValues>();

  const onSubmit = () => {
    const values = getValues();
    if (!values.quote || !values.author) {
      // ถ้าไม่มีข้อมูล quote หรือ author ให้แสดงข้อความผิดพลาด
      toast.error("Please fill in all fields.", {
        position: "top-center",
        richColors: true,
      });
      return;
    }

    mutate(
      {
        body: {
          quote: values.quote,
          author: values.author,
        },
        options: {
          access_token: session?.accessToken || "",
        },
      },
      {
        onSuccess: () => {
          toast.success("Quote created successfully!", {
            position: "top-center",
            richColors: true,
          });
          setModalCreateOpen(false);
          refetch?.();
          reset();
        },
        onError: (error) => {
          toast.error(`Error creating quote: ${error.message}`, {
            position: "top-center",
            richColors: true,
          });
        },
      },
    );
  };

  useEffect(() => {
    if (modalCreateOpen) {
      reset({
        author: session?.user?.username || "",
      });
    }
  }, [modalCreateOpen, reset, session?.user]);

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b border-border">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="3xl:fixed:container flex h-14 justify-between items-center gap-2">
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  <Castle className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Hi~</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div
            hidden={hiddenSearch}
            className="flex w-full max-w-xs items-center gap-2"
          >
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search ..."
                className="pl-8"
                onChange={(e) => handleSetSearchValue?.(e.target.value)}
                value={searchValue || ""}
              />
              <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            </div>
            <Dialog open={modalCreateOpen} onOpenChange={setModalCreateOpen}>
              <form>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size={"icon"}
                    className="cursor-pointer"
                  >
                    <Plus />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Quote</DialogTitle>
                    <DialogDescription>
                      Create your quote here. Click save when you&apos;re done.
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
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
          <div>
            <div className="flex gap-4">
              {status !== "authenticated" && (
                <Button
                  onClick={() => router.push("/login")}
                  className="cursor-pointer"
                >
                  Login
                </Button>
              )}
              {status === "authenticated" && (
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
