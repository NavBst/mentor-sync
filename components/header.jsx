import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  ChevronDown,
  FileText,
  LayoutDashboard,
  MessageSquare,
  PenBox,
  StarsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
   const log = await checkUser();

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-backdrop-filter:bg-background/60 flex items-center px-5">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={"/"}>
          <Image
            src={"/logo.png"}
            width={200}
            height={80}
            alt="logo"
            className="h-24 py-1 object-contain w-auto"
            loading="eager"
          />
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button variant="outline" className="cursor-pointer">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:block">Industry Insights</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden sm:block">Growth Tools</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={"/resume"} className="flex item center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Build Resume</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={""} className="flex item center gap-2">
                    <PenBox className="h-4 w-4" />
                    <span>AI Cover Letter</span>
                  </Link>
                </DropdownMenuItem>{" "}
                <DropdownMenuItem>
                  <Link href={"/interview"} className="flex item center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Interview Prep</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
        </div>
      </nav>
      <SignedIn>
        <UserButton 
          appearance={{
            elements:{
              avatarBox: "w-10 h-10",
              userButtonPopoverCard: "shadow-xl",
              userPreviewMainIdentifier: "font-semibold"
            }
          }}
          clasName="cursor-pointer"
          afterSignOutUrl="/"
        />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button variant="outline" className="cursor-pointer">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </header>
  );
};

export default Header;
