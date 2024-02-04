"use client";
import { useState } from "react";
import AWS from "../../../../awsConfig";
import markdownToHtml from "../../../lib/markdownToHtml";
import Container from "../../_components/container";
import Header from "../../_components/header";
import { PostBody } from "../../_components/post-body";
import { PostHeader } from "../../_components/post-header";
import { useEffect } from "react";

export default function Post({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError]: any = useState(null);
  const [postData, setPostData]: any = useState(null);
  const [content, setContent] = useState("");
  const [refresh, setRefresh] = useState(false);

  const slugValue = params.slug;

  useEffect(() => {
    console.log("Fetched");
    const lambda = new AWS.Lambda();
    const params = {
      FunctionName: "fetchDocumentFromDynamoDB",
      Payload: JSON.stringify({
        slug: slugValue,
      }),
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await lambda.invoke(params).promise();
        if (response.Payload) {
          const parsedData = JSON.parse(response.Payload);
          setPostData(parsedData);
          const markdownContent = JSON.parse(parsedData.body).content || "";
          const htmlContent = await markdownToHtml(markdownContent);
          setContent(htmlContent);
        } else {
          console.error("Payload is empty");
        }
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh]); // This effect runs whenever the 'refresh' variable changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!postData) {
    return <p>No data available</p>;
  }

  const parsedBody = JSON.parse(postData.body);

  return (
    <main>
      {/* <div className="text-xl text-red-700 font-bold italic">{params.slug}</div>
      <pre>{JSON.stringify(parsedBody, null, 2)}</pre> */}
      <button
        className="p-2 hover:bg-gray-200 border-2 border-red-300"
        onClick={() => {
          setRefresh((prev) => !prev);
        }}
      >
        Refresh the page
      </button>
      {/* <div>{parsedBody.content}</div> */}
      {/* <Alert preview={parsedBody.preview} /> */}
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={parsedBody.title}
            coverImage={parsedBody.coverImage}
            date={parsedBody.date}
            author={parsedBody.author}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}
