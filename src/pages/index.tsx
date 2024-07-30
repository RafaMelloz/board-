import { db } from "@/services/firebaseConnection";
import { collection, getDocs } from "firebase/firestore";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";

interface HomeProps{
  comments:number,
  posts:number
}

export default function Home({comments, posts} :HomeProps) {
  return (
    <>
      <Head>
        <title>Board +</title>
      </Head>
      <main className="w-full bg-zinc-900 h-screenWithHeader flex flex-col justify-center items-center gap-10">

        <div className="max-w-md w-full">
          <Image
            className="w-full"
            src={"/assets/hero.png"}
            alt="Hero"
            width={500}
            height={300}
            priority
          />
        </div>

        <h2 className="text-white font-semibold text-3xl text-center max-w-lg cursor-default">Sistema feito para você organizar seus estudos e tarefas</h2>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-10 justify-between">
          <span className="bg-white text-zinc-900 font-semibold px-4 py-2 rounded-md min-w-44 block flex-nowrap text-center transition-all duration-75 hover:scale-105 cursor-default">+ {posts} posts</span>
          <span className="bg-white text-zinc-900 font-semibold px-4 py-2 rounded-md min-w-44 block flex-nowrap text-center transition-all duration-75 hover:scale-105 cursor-default">+ {comments} comentários</span>
        </div>
      </main>
    </>
  );
}




export const getStaticProps: GetStaticProps = async () =>{
  //Buscar do banco os numeros e mandar para o component
  const commentRef = collection(db, "comments")
  const commentSnapshot = await getDocs(commentRef)

  const postRef = collection(db, "tasks")
  const postSnapshot = await getDocs(postRef)




  return{
    props:{
      posts: postSnapshot.size || 0,
      comments: commentSnapshot.size || 0
    },
    revalidate: 60
  }
}