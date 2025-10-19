"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import useSWR from "swr/immutable";
import { getMessages, submitMessage } from "@/lib/actions/guestbook";
import { authClient } from "@/lib/auth/client";

import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { PlusSeparator } from "@/components/ui/plus-separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ButtonGroup } from "@/components/ui/button-group";
import { SendHorizonal } from "lucide-react";

export default function GuestbookPage() {
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [message, setMessage] = useState("");
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [sending, setSending] = useState(false);
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [turnstileDialogVisible, setTurnstileDialogVisible] = useState(false);
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const { data: guestbook } = useSWR("guestbook-messages", getMessages);
  const { data: session } = useSWR("auth-session", () =>
    authClient.getSession(),
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    }, 3000);

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.style.pointerEvents = "auto";
      }
    };
  }, []);

  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  async function sendMessageGuestbook() {
    if (sending) return;

    if (!turnstileToken) {
      setTurnstileDialogVisible(true);
      return;
    }

    setSending(true);
    const submitPromise = submitMessage(turnstileToken, message).then(() => {
      window.location.reload();
    });

    toast.promise(submitPromise, {
      loading: "Sending message...",
      success: (_res) => {
        setMessage("");
        return "Message sent!";
      },
      error: (err) => {
        console.error(err);
        return "Failed to send message.";
      },
    });
  }

  return (
    <main className="-mb-16 mt-16">
      <div className="border-separator/10 border-t">
        <div className="inner relative flex max-w-[64rem] border-separator/10 border-x">
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
            <div className="group relative flex h-[12rem] overflow-hidden bg-background/50">
              <div className="absolute top-4 left-4 size-16 bg-foreground blur-[10rem] transition-all group-hover:blur-[7rem]"></div>
              <div className="absolute right-4 bottom-4 size-16 bg-foreground blur-[7rem] transition-all group-hover:blur-[6rem]"></div>
              <Image
                src="/static/images/typography/hexaas-guestbook.webp"
                alt="Hexaas Guestbook"
                width={1080}
                height={1080}
                className="h-full w-full object-cover opacity-70 transition group-hover:opacity-100 dark:opacity-80 dark:invert group-hover:dark:opacity-100"
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
        </div>
        <div className="border-separator/10 border-t">
          <div
            ref={scrollContainerRef}
            data-lenis-prevent
            className="inner relative flex h-[32rem] max-w-[64rem] touch-pan-y flex-col overflow-y-scroll border-separator/10 border-x"
          >
            <div className="flex grow flex-col">
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
              <p>{JSON.stringify(guestbook)}</p>
            </div>
          </div>
          <div className="border-separator/10 border-t border-dashed">
            <div className="inner relative h-[8rem] max-w-[64rem] overflow-hidden border-separator/10 border-x border-dashed">
              <span className="absolute top-0 left-0 size-16 bg-muted-foreground/100 blur-[100px]" />
              <span className="absolute right-2 bottom-2 size-16 bg-muted-foreground/30 blur-[50px]" />
              {session?.data?.user ? (
                <div className="flex h-full flex-col gap-2">
                  <textarea
                    className="h-full grow rounded bg-background p-4 outline-none focus:border-0 focus:ring-0"
                    placeholder="Type your message here."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              ) : (
                <div>
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
          <div className="border-separator/10 border-y border-dashed">
            <div className="inner relative flex max-w-[64rem] items-center justify-between gap-4 overflow-hidden border-separator/10 border-x border-dashed px-4 py-3">
              <p
                className={`text-sm transition duration-300 ${message.length > 1024 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {message.length.toLocaleString()}/
                {Number(1024).toLocaleString()} characters
              </p>
              <ButtonGroup>
                <Button variant="outline">Default</Button>
                <Button variant="outline">Button</Button>
                <Button variant="outline">Group</Button>
                <Button variant="outline" size="icon">
                  <SendHorizonal />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
