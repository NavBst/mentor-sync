import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0  w-full border-b bg-background/80 backdrop-blur-md z-50 supports-backdrop-filter:bg-background/60 flex">
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
        <div>
            <SignedIn>
                <Link href={"/dashboard"}>
                    <Button>
                        <LayoutDashboard className="h-4 w-4"/>
                        <span className="hidden sm:block">Industry Insights</span>
                    </Button>
                </Link>
            </SignedIn>
        </div>
      </nav>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </header>
  );
};

export default Header;
