import { TextArea } from "@/components/textArea";
import { db } from "@/services/firebaseConnection";
import { doc, getDoc, collection, query, where, addDoc, getDocs, deleteDoc} from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";
import { LuTrash } from "react-icons/lu";

interface TaskProp {
    item:{
        task: string
        public: boolean
        create: string
        user: string
        taskId: string
    }
    allComments: CommentProps[]
} 

interface CommentProps {
    id:string
    comment: string
    user:string
    name: string
    taskId: string
}

export default function Task({ item, allComments }:TaskProp){
    const { data: session} = useSession();
    const [input, setInput] = useState('')
    const [comments, setComments] = useState<CommentProps[]>(allComments || [])

    const handleSubmit = async(e: FormEvent) =>{
        e.preventDefault()

        if (input === '') return;
        if (!session?.user?.email || !session?.user.name) return;

        try {
            const ref = await addDoc(collection(db, "comments"),{
                comment: input,
                create: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            })
            const data = {
                id: ref.id,
                comment: input,
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            }

            setComments((old) => [...old, data])
            setInput('')
        } catch (err) {
            console.error(err);
        }
    } 

    const handleDeleteComment = async (id:string) =>{
        try {
            const ref = doc(db, "comments", id)
            await deleteDoc(ref)

            const deleteComment = comments.filter((comment) => comment.id !== id)
            setComments(deleteComment)

        } catch (err) {
            console.error(err);
        }
    }

    return(
        <>
            <Head>
                <title>Tarefa</title>
            </Head>
            <main className="centralize h-screenWithHeader py-16">
                <section>
                    <h2 className="text-3xl font-semibold mb-4">Tarefa</h2>
                    <article className="border-2 border-zinc-600 rounded-lg p-4 mb-10">
                        <p className="whitespace-pre-wrap w-full">{item.task}</p>
                    </article>

                    <form onSubmit={handleSubmit}>
                        <TextArea
                            value={input}
                            idTextArea="comment"
                            label="Deixar comentário"
                            placeholder="Digite seu comentário"
                            rows={5}
                            labelColor="text-black"
                            textAreaColor="bg-transparent border-zinc-600 focus:border-sky-700"
                            onChangeFunction={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                        />

                        <button disabled={!session?.user} type="submit" className="bg-sky-500 text-white font-semibold text-xl rounded-lg w-full py-2 mt-4 transition-all duration-300 hover:bg-sky-700 disabled:bg-sky-500/50 disabled:cursor-not-allowed">
                            Registrar
                        </button>
                    </form>
                </section>

                <section className="mt-16">
                    <h2 className="text-center font-bold text-4xl">Comentários</h2>

                    {comments.length === 0 &&(
                        <p className="py-10 text-center">Nenhum comentário por enquanto...</p>
                    )}

                    <ul>
                        {comments.map(comment => (
                            <li key={comment.id} className="flex flex-col gap-2 p-4 rounded-lg mt-4 border border-zinc-600">
                                <div className="flex items-center gap-2">
                                    <span className="bg-sky-500/80 py-1 px-2 font-semibold text-white rounded w-fit">{comment.name}</span>
                                    {comment.user === session?.user?.email &&(
                                        <button onClick={() => handleDeleteComment(comment.id)} className="w-fit h-fit text-red-600 font-semibold text-2xl rounded-lg py-2 transition-all duration-300 hover:text-red-700 focus:outline-none">
                                            <LuTrash />
                                        </button>
                                    )}
                                </div>

                                <p className="text-black whitespace-pre-wrap">{comment.comment}</p>

                                
                            </li>
                        ))}
                    </ul>
                </section>   
            </main>
        </>
    )
}


export const getServerSideProps : GetServerSideProps = async ({ params }) => {
    const id = params?.id as string;

    const ref = doc(db, "tasks", id);

    const refComments = collection(db, "comments")
    const q = query(refComments, where("taskId", "==", id))

    const snapshot = await getDoc(ref);
    if (snapshot.data() === undefined) {
        return{
            redirect:{
                destination:'/',
                permanent: false
            }
        }
    }

    if(!snapshot.data()?.public){
        return{
            redirect:{
                destination:'/',
                permanent: false
            }
        }
    }

    const snapshotComments = await getDocs(q)
    

    let allComments: CommentProps[] = []
    snapshotComments.forEach((doc)=>{
        allComments.push({
            id: doc.id,
            comment: doc.data().comment,
            user: doc.data().user,
            name: doc.data().name,
            taskId: doc.data().taskId
        })
    })

    const miliSeconds = snapshot.data()?.create?.seconds * 1000;
    const task = {
        task: snapshot.data()?.task,
        public: snapshot.data()?.public,
        create: new Date(miliSeconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id
    }

    return {
        props: {
            item: task,
            allComments
        }
    }
}
