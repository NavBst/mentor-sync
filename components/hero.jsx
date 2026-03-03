"use client"
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const HeroSection = () => {
    const imageRef = useRef(null);

    useEffect(() => {
        const imageEle = imageRef.current;

        const handleScroll = () => {

        const scrollPositon = window.scrollY;
        const scrollThreshold = 100;

        if(scrollPositon > scrollThreshold){
            imageEle.classList.add("scrolled");
        }
        else{
            imageEle.classList.remove("scrolled");
        }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
}, [])

  return (
    <section className="z-10 w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-title">
            Your AI Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-150 text-muted-foreground md:text-xl">
            Advance your career with personalized guidance, interview prep and
            AI-powered tools for job success.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link href={"/dashboard"}>
            <Button size="lg" className={"px-8"}>
              Get Started
            </Button>
          </Link>
          <Link href={"/https://www.youtube.com/watch?v=UbXpRv5ApKA"}>
            <Button variant="outline" size="lg" className={"px-8"}>
              Get Started
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src={"/banner.webp"}
              width={"1120"}
              height={"720"}
              alt="banner-mentorsync"
              className="rounded-lg w-full sm:w-280 shadow-2xl border mx-auto"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
