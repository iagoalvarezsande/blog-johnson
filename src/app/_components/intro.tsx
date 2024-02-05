import { CMS_NAME } from "@/lib/constants";
import Image from "next/image";

export function Intro() {
  return (
    <section className=" mt-16 mb-16 md:mb-12">
      <div className=" flex items-center justify-center mt-8">
        <Image
          src="/assets/blog/preview/cover.svg"
          width={500}
          height={400}
          className=" rounded-xl"
          alt="/"
        />
      </div>
      <h1 className=" text-5xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8">
        Hello there
      </h1>
    </section>
  );
}
