"use client";

import Container from "@/app/_components/container";
import React, { useState, useEffect } from "react";
import AWS from "../../awsConfig";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import Image from "next/image";
import router, { useRouter } from "next/navigation";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [error, setError]: any = useState(null);
  const [allBlogPostsMetadata, setAllBlogPostsMetadata]: any = useState(null);
  const [refresh, setRefresh] = useState(false);

  const router = useRouter();

  useEffect(() => {
    console.log("Fetched");
    const lambda = new AWS.Lambda();
    const params = {
      FunctionName: "getAllBlogPostsMetadata",
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await lambda.invoke(params).promise();
        if (response.Payload) {
          const parsedData = JSON.parse(response.Payload);
          console.log(
            `This are all the blog posts metadata ${JSON.stringify(parsedData)}`
          );
          setAllBlogPostsMetadata(parsedData);
        } else {
          console.error("Payload is empty");
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        console.error(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  if (loading) {
    return <p className="animate-pulse">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500 text-lg">
        An error occurred while fetching the blog posts metadata.
      </p>
    );
  }

  if (!allBlogPostsMetadata || !allBlogPostsMetadata.body) {
    return <p>No data available, start writing blog posts!</p>;
  }

  const posts = JSON.parse(allBlogPostsMetadata.body);

  return (
    <main>
      <Container>
        <Intro />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-4 w-full h-full md:w-8/12">
          {posts.map((post: any) => (
            <button
              key={post.slug}
              onClick={() => router.push(`/posts/${post.slug}`)}
              className="w-full bg-zinc-100 h-fit rounded-lg border border-gray-300 shadow hover:shadow-2xl hover:scale-[101%] p-2 transition-all"
            >
              <Image
                src={post.coverImage}
                alt={`Cover Image for ${post.title}`}
                width={300}
                height={300}
              />
              <div className="py-2 flex flex-col items-start">
                <h2 className="text-2xl tracking-tight font-medium">
                  {post.title}
                </h2>
                {post?.author && (
                  <p className="text-sm text-zinc-400">@{post.author.name}</p>
                )}
                <p className="text-zinc-500 text-start">{post.excerpt}</p>
              </div>
            </button>
          ))}
        </div>
      </Container>
    </main>
  );
}
