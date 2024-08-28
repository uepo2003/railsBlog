import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

interface Post {
  id: string;
  title: string;
  content: string;
}

type Props = {
  posts: Post[];
};

export async function getStaticProps() {
  const res = await fetch("http://localhost:3001/api/v1/posts");
  const posts = await res.json();

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
}
export default function Home({ posts }: Props) {
  const router = useRouter();

  // Update function
  const handleUpdate = async (post: Post) => {
    router.push(`/edit-post/${post.id}`);
  };

  // Delete function
  const handleDelete = async (id: any) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/v1/posts/${id}`
      );

      router.reload();
    } catch (error) {
      console.error(error);
      alert("Error deleting post");
    }
  };
  return (
    <>
      <Head>
        <title>Blog Rails</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.homeContainer}>
        <h2>Rails & Next.js Blog</h2>
        <Link href="/createPost" className={styles.createButton}>
          Create New Post
        </Link>
        <div>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <Link href={`posts/${post.id}`} className={styles.postCardBox}>
                <h2>{post.title}</h2>
              </Link>
              <p>{post.content}</p>
              <button
                className={styles.editButton}
                onClick={() => handleUpdate(post)}
              >
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
