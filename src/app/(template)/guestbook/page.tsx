"use client";

import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { Turnstile } from "@marsidev/react-turnstile";
import { Crown, LogOut, SendHorizonal, SmilePlus } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useSWR, { type KeyedMutator } from "swr";
import { CloudflareImage } from "@/components/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { PlusSeparator } from "@/components/ui/plus-separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getMessages,
  type MessageWithReactions,
  reactMessage,
  submitMessage,
} from "@/lib/actions/guestbook";
import { authClient } from "@/lib/auth/client";
import type {
  guestbookReactionTable,
  guestbookTable,
} from "@/lib/db/schema/guestbook";
import { EventEmitter } from "@/lib/helpers";

// hexaa's user ID
// yeah ik it's hardcoded, i'm lazy asf
const authorUserId = "euvPPRy7QJWB9UlcLz8gqDVav4byXGYg";

export default function GuestbookPage() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isTurnstileDialogVisible, setIsTurnstileDialogVisible] = useState<
    false | "message" | "reaction"
  >(false);
  const [isSignOutDialogVisible, setIsSignOutDialogVisible] = useState(false);

  const [reactionListVisible, setReactionListVisible] = useState<
    false | string
  >(false);
  const {
    data: guestbook,
    mutate: mutateGuestbook,
    isLoading,
    isValidating,
  } = useSWR("guestbook-messages", getMessages);
  const { data: session } = useSWR("auth-session", () =>
    authClient.getSession(),
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run scroll behavior when data is loaded
    if (!guestbook || isLoading) return;

    const container = scrollContainerRef.current;
    if (container) {
      container.style.pointerEvents = "none";
    }

    const timeout = setTimeout(() => {
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });

        const scrollDuration = 600; // ms, adjust if needed
        setTimeout(() => {
          container.style.pointerEvents = "auto";
        }, scrollDuration);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.style.pointerEvents = "auto";
      }
    };
  }, [guestbook, isLoading]);

  async function sendMessageGuestbook(turnstileToken?: string) {
    if (sending) return;

    if (message.trim().length === 0) {
      toast.error("Message cannot be empty.");
      return;
    } else if (message.length > 1024) {
      toast.error("Message is too long.");
      return;
    } else if (message.split("\n").length > 3) {
      toast.error("Message cannot have more than 3 lines.");
      return;
    }

    if (!turnstileToken) {
      setIsTurnstileDialogVisible("message");
      return;
    }

    setSending(true);
    const submitPromise = submitMessage(turnstileToken, message).then(() => {
      mutateGuestbook();
    });

    toast.promise(submitPromise, {
      loading: "Sending message...",
      success: (_res) => {
        setMessage("");
        setSending(false);
        return "Message sent!";
      },
      error: (err) => {
        console.error(err);
        return "Failed to send message.";
      },
    });
  }

  return (
    <main className="mt-16">
      <div className="border-separator/10 border-t">
        <div className="inner relative flex max-w-5xl border-separator/10 border-x">
          <div className="hidden flex-col lg:flex">
            <div className="size-8 border-separator/10 border-r border-b sm:size-20"></div>
            <div className="grow border-separator/10 border-r"></div>
            <div className="size-8 border-separator/10 border-t border-r sm:size-20"></div>
          </div>
          <div className="flex grow flex-col">
            <div className="flex w-full">
              <div className="size-8 border-separator/10 border-r border-b sm:size-20"></div>
              <div className="hidden size-8 border-separator/10 border-r border-b sm:size-20 lg:block"></div>
              <div className="grow border-separator/10 border-b"></div>
              <div className="hidden size-8 border-separator/10 border-b border-l sm:size-20 lg:block"></div>
              <div className="size-8 border-separator/10 border-b border-l sm:size-20"></div>
            </div>
            <div className="group relative flex h-48 overflow-hidden bg-background/50">
              <div className="absolute top-4 left-4 size-16 bg-foreground blur-[10rem] transition-all group-hover:blur-[7rem]"></div>
              <div className="absolute right-4 bottom-4 size-16 bg-foreground blur-[7rem] transition-all group-hover:blur-[6rem]"></div>
              <CloudflareImage
                src="/typography/hexaas-guestbook.webp.unoptimized"
                category="assets"
                alt="Hexaas Guestbook"
                width={1080}
                height={1080}
                className="aspect-auto h-full w-full object-cover opacity-70 transition group-hover:opacity-100 dark:opacity-80 dark:invert group-hover:dark:opacity-100"
              />
            </div>
            <div className="flex w-full">
              <div className="size-8 border-separator/10 border-t border-r sm:size-20"></div>
              <div className="hidden size-8 border-separator/10 border-t border-r sm:size-20 lg:block"></div>
              <div className="grow border-separator/10 border-t"></div>
              <div className="hidden size-8 border-separator/10 border-t border-l sm:size-20 lg:block"></div>
              <div className="size-8 border-separator/10 border-t border-l sm:size-20"></div>
            </div>
          </div>
          <div className="hidden flex-col lg:flex">
            <div className="size-8 border-separator/10 border-b border-l sm:size-20"></div>
            <div className="grow border-separator/10 border-l"></div>
            <div className="size-8 border-separator/10 border-t border-l sm:size-20"></div>
          </div>
          <PlusSeparator
            main={{ className: "-top-[5px]" }}
            position={["top-left", "top-right"]}
          />
          <PlusSeparator
            main={{ className: "-bottom-[5px]" }}
            position={["bottom-left", "bottom-right"]}
          />
        </div>
        <div className="border-separator/10 border-t">
          <div
            ref={scrollContainerRef}
            data-lenis-prevent
            className="inner relative flex h-128 max-w-5xl touch-pan-y flex-col overflow-y-auto border-separator/10 border-x"
          >
            {isLoading ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="relative size-16">
                  <Image
                    src="/static/images/assets/mona-loading-default.gif"
                    alt="Loading..."
                    fill
                    className="dark:hidden"
                  />
                  <Image
                    src="/static/images/assets/mona-loading-dark.gif"
                    alt="Loading..."
                    fill
                    className="hidden dark:block"
                  />
                </div>
                <p className="mt-4 text-muted-foreground">
                  Loading messages...
                </p>
              </div>
            ) : (
              <div className="relative flex grow flex-col">
                {isValidating && (
                  <div className="sticky top-5 right-0 left-0">
                    <div className="absolute right-5 flex items-center justify-center">
                      <div className="relative size-16 animate-fd-fade-in">
                        <Image
                          src="/static/images/assets/mona-loading-default.gif"
                          alt="Loading..."
                          fill
                          className="opacity-50 dark:hidden"
                        />
                        <Image
                          src="/static/images/assets/mona-loading-dark.gif"
                          alt="Loading..."
                          fill
                          className="hidden opacity-50 dark:block"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {(guestbook || []).map((msg) => (
                  <div
                    key={msg.id}
                    className="border-separator/10 border-b last:border-0"
                  >
                    <div className="flex gap-4 px-8 py-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
                        {msg.user.image ? (
                          <Avatar className="m-auto size-12 border">
                            <AvatarImage
                              src={`${msg.user.image}?size=32`}
                              alt={msg.user.name || "Guestbook User Avatar"}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              {msg.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <span className="absolute inset-0 grid place-items-center text-2xl text-muted-foreground">
                            {msg.user.name
                              ? msg.anonymous
                                ? "?"
                                : msg.user.name.charAt(0).toUpperCase()
                              : "G"}
                          </span>
                        )}
                      </div>
                      <div className="flex grow flex-col gap-2">
                        <span className="line-clamp-1 flex items-center gap-2 truncate">
                          <p className="font-semibold text-lg">
                            {msg.user.name || "Anonymous User"}
                          </p>
                          {msg.userId === authorUserId && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1 text-2xs"
                            >
                              <Crown />
                              Author
                            </Badge>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-muted-foreground text-sm">
                                • {moment(msg.createdAt).fromNow()}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{moment(msg.createdAt).format("LLLL")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </span>
                        <p className="whitespace-pre-wrap rounded-b-2xl rounded-tr-2xl bg-accent p-2 px-4">
                          {msg.message}
                        </p>
                        <div className="flex items-center gap-1">
                          {msg.reactions.map((reaction) => (
                            <ReactionBadge
                              type="existing"
                              key={reaction.id}
                              details={reaction}
                              currentUserId={session?.data?.user?.id || ""}
                              messageDetails={msg}
                              setIsTurnstileDialogVisible={
                                setIsTurnstileDialogVisible
                              }
                              setSending={setSending}
                              mutateGuestbook={mutateGuestbook}
                            />
                          ))}
                          <ReactionBadge
                            type="new"
                            messageDetails={msg}
                            reactionListVisible={reactionListVisible}
                            setReactionListVisible={setReactionListVisible}
                            setIsTurnstileDialogVisible={
                              setIsTurnstileDialogVisible
                            }
                            setSending={setSending}
                            mutateGuestbook={mutateGuestbook}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-separator/10 border-y border-dashed">
            <div className="inner absolute right-0 left-0 mx-auto h-32 w-full max-w-5xl">
              <PlusSeparator
                position={[
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right",
                ]}
                child={{
                  "top-left": {
                    className: "-left-[3px] z-10",
                  },
                  "top-right": {
                    className: "-right-[3px] z-10",
                  },
                  "bottom-left": {
                    className: "-left-[3px] -bottom-[5px] z-10",
                  },
                  "bottom-right": {
                    className: "-right-[3px] -bottom-[5px] z-10",
                  },
                }}
              />
            </div>
            <div className="inner relative h-32 max-w-5xl overflow-hidden border-separator/10 border-x border-dashed">
              <span className="absolute top-0 left-0 size-16 bg-muted-foreground blur-[100px]" />
              <span className="absolute right-2 bottom-2 size-16 bg-muted-foreground/30 blur-[50px]" />
              {session?.data?.user ? (
                <div className="flex h-full flex-col gap-2">
                  <textarea
                    className="h-full grow rounded bg-background p-4 outline-none focus:border-0 focus:ring-0"
                    placeholder="Type your message here."
                    value={message}
                    disabled={sending}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <p className="text-muted-foreground text-sm">
                    Sign in to comment and react. Don't worry, your data is
                    safe.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        authClient.signIn.social({
                          provider: "discord",
                          callbackURL: `${window.location.origin}/guestbook`,
                        })
                      }
                    >
                      <SiDiscord /> Discord
                    </Button>
                    <Button
                      onClick={() =>
                        authClient.signIn.social({
                          provider: "github",
                          callbackURL: `${window.location.origin}/guestbook`,
                        })
                      }
                    >
                      <SiGithub /> Github
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {session?.data?.user && (
            <div className="border-separator/10 border-b border-dashed">
              <div className="inner relative flex max-w-5xl flex-col items-center justify-between gap-4 border-separator/10 border-x border-dashed px-4 py-3 md:flex-row">
                <span className="flex items-center gap-2">
                  <p className="text-muted-foreground text-sm">Logged in as</p>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1.5"
                      >
                        {session.data.user.image ? (
                          <div className="relative size-6 overflow-hidden rounded-full bg-muted">
                            <Image
                              src={session.data.user.image}
                              alt={session.data.user.name || "User Avatar"}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="grid size-6 place-items-center rounded-full bg-muted text-muted-foreground">
                            {session.data.user.name
                              ? session.data.user.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                        )}
                        <p className="font-medium">
                          {session.data.user.name || "Anonymous User"}
                        </p>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{session.data.user.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
                <p
                  className={`text-sm transition duration-300 ${message.length > 1024 ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {message.length.toLocaleString()}/
                  {Number(1024).toLocaleString()} characters
                </p>
                <ButtonGroup>
                  <Button
                    variant="destructive"
                    onClick={() => setIsSignOutDialogVisible(true)}
                  >
                    <LogOut />
                    Sign Out
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      sendMessageGuestbook();
                    }}
                    disabled={
                      sending || message.length === 0 || message.length > 1024
                    }
                  >
                    Send
                    <SendHorizonal />
                  </Button>
                </ButtonGroup>
                <PlusSeparator
                  position={["bottom-left", "bottom-right"]}
                  child={{
                    "bottom-left": {
                      className: "-bottom-[5px] z-10",
                    },
                    "bottom-right": {
                      className: "-bottom-[5px] z-10",
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Turnstile Captcha Dialog */}
      <Dialog
        open={isTurnstileDialogVisible !== false}
        onOpenChange={(open) => open && setIsTurnstileDialogVisible(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you a human? Please complete the challenge below.
            </DialogTitle>
          </DialogHeader>
          <Turnstile
            className="mx-auto"
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={async (token) => {
              setIsTurnstileDialogVisible(false);

              await delay(1000);
              if (isTurnstileDialogVisible === "message") {
                sendMessageGuestbook(token);
              } else if (isTurnstileDialogVisible === "reaction") {
                reactionEvent.emit("turnstile-success", token);
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog
        open={isSignOutDialogVisible}
        onOpenChange={setIsSignOutDialogVisible}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your account. You can sign in again
              later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsSignOutDialogVisible(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsSignOutDialogVisible(false);

                const signOutPromise = authClient.signOut().then(() => {
                  window.location.reload();
                });

                toast.promise(signOutPromise, {
                  loading: "Signing out...",
                  success: "Signed out successfully.",
                  error: "Failed to sign out.",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ReactionBadge(
  data:
    | {
        type: "new";
        messageDetails: typeof guestbookTable.$inferSelect;

        reactionListVisible: false | string;
        setReactionListVisible: (value: false | string) => void;
        setIsTurnstileDialogVisible: (
          value: false | "message" | "reaction",
        ) => void;
        setSending: (value: boolean) => void;

        mutateGuestbook: KeyedMutator<MessageWithReactions[]>;
      }
    | {
        type: "existing";
        details: typeof guestbookReactionTable.$inferSelect;
        currentUserId: string;

        messageDetails: typeof guestbookTable.$inferSelect;
        setIsTurnstileDialogVisible: (
          value: false | "message" | "reaction",
        ) => void;
        setSending: (value: boolean) => void;

        mutateGuestbook: KeyedMutator<MessageWithReactions[]>;
      },
) {
  if (data.type === "new") {
    return (
      <Popover
        open={data.reactionListVisible === data.messageDetails.id}
        onOpenChange={(open) => {
          data.setReactionListVisible(open ? data.messageDetails.id : false);
        }}
      >
        <PopoverTrigger asChild>
          <Badge
            variant="secondary"
            className="flex h-6 cursor-pointer items-center gap-1 rounded-2xl p-0 px-3 text-xs hover:bg-secondary"
            asChild
          >
            <Button
              onClick={() => {
                data.setReactionListVisible(data.messageDetails.id);
              }}
            >
              <span className="-m-4 p-4 transition duration-500">
                <SmilePlus />
              </span>
            </Button>
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0" data-lenis-prevent>
          <EmojiPicker
            className="h-[342px]"
            onEmojiSelect={({ emoji }) => {
              data.setReactionListVisible(false);
              sendReactionEmoji(data, emoji);

              data.setIsTurnstileDialogVisible("reaction");
            }}
            data-lenis-prevent
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </PopoverContent>
      </Popover>
    );
  } else if (data.type === "existing") {
    const emoji = data.details.emoji;
    const count = data.details.userIds ? data.details.userIds.length : 0;

    if (count === 0) return null;

    return (
      <Badge
        variant={
          data.details.userIds?.includes(data.currentUserId || "")
            ? "default"
            : "secondary"
        }
        className={`flex h-6 cursor-pointer items-center gap-1 rounded-2xl p-0 px-3 text-xs ${data.details.userIds?.includes(data.currentUserId || "") ? "hover:bg-primary" : "hover:bg-secondary"}`}
        asChild
      >
        <Button
          onClick={() => {
            if (data.details.userIds?.includes(data.currentUserId || "")) {
              const reactMessagePromise = reactMessage(
                "remove",
                data.details.guestbookId,
                emoji,
              );

              toast.promise(reactMessagePromise, {
                loading: "Removing reaction...",
                success: "Reaction removed!",
                error: "Failed to remove reaction.",
                finally: () => {
                  data.setSending(false);
                  data.mutateGuestbook();
                },
              });
            } else {
              sendReactionEmoji(data, emoji);
              data.setIsTurnstileDialogVisible("reaction");
            }
          }}
        >
          <span className="-m-4 p-4 transition duration-500 hover:invert">
            {emoji}
          </span>
          <span>{count}</span>
        </Button>
      </Badge>
    );
  }
}

const reactionEvent = new EventEmitter();

async function sendReactionEmoji(
  data: Parameters<typeof ReactionBadge>["0"],
  emoji: string,
) {
  const waitForTurnstile = new Promise<string>((resolve) => {
    reactionEvent.once("turnstile-success", (token: string) => {
      resolve(token);
    });
  });

  await new Promise<void>((resolve) => {
    toast.promise(waitForTurnstile, {
      success: (_token) => {
        resolve();
        return `Captcha completed!`;
      },
      loading: "Waiting for captcha completion...",
      error: "Captcha was not completed.",
    });
  });

  const reactionPromise = reactMessage(
    "add",
    data.messageDetails.id,
    emoji,
    await waitForTurnstile,
  ).then((res) => {
    if (res === "success") {
      return "Reaction added!";
    } else if (res === "turnstile-failed") {
      throw new Error("Captcha verification failed. Please try again.");
    } else if (res === "not-authenticated") {
      throw new Error("You must be signed in to react.");
    } else if (res === "invalid-emoji") {
      throw new Error("Invalid emoji. Please select a valid emoji.");
    } else if (res === "emoji-too-long") {
      throw new Error("Emoji is too long. Please select a shorter emoji.");
    }
  });

  toast.promise(reactionPromise, {
    loading: "Adding reaction...",
    success: (msg) => msg,
    error: (err) => err.message,
    finally: () => {
      data.setSending(false);
      data.mutateGuestbook();
    },
  });

  data.setSending(true);
}
