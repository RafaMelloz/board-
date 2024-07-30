import { ChangeEvent, FormEvent, useEffect, useState } from "react";

//next
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

//firebase
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

//componentes
import { TextArea } from "@/components/textArea";

//icons
import { FaShare } from "react-icons/fa";
import { LuTrash } from "react-icons/lu";

interface dashboardProps {
    user:{
        email: string;
    }
}

interface taskProps {
    id: string;
    create: Date;
    user: string;
    task: string;
    public: boolean;
}

export default function Dashboard({ user }: dashboardProps ) {

    const [input, setInput] = useState("");
    const [taskPublic, setTaskPublic] = useState(false);
    const [tasks, setTasks] = useState<taskProps[]>([]);

    useEffect(() => {
        // Função assíncrona para carregar as tarefas
        async function loadTarefas() {
            // Conecta com o banco de dados Firestore e acessa a coleção 'tasks'
            const tasksCollection = collection(db, "tasks");

            // Cria uma consulta para buscar as tarefas:
            // - Ordena pela data de criação ('create') em ordem decrescente
            // - Filtra as tarefas para incluir apenas aquelas cujo campo 'user' seja igual ao email do usuário atual
            const q = query(tasksCollection, orderBy("create", "desc"), where("user", "==", user?.email));

            // Configura um listener para observar mudanças na consulta 'q'
            onSnapshot(q, (snapshot) => {
                let list: taskProps[] = [];
                snapshot.forEach(doc => {
                    list.push({
                        id: doc.id,
                        create: doc.data().create,
                        user: doc.data().user,
                        task: doc.data().task,
                        public: doc.data().public
                    });
                });
                setTasks(list);
            });
        }
        loadTarefas();
    }, [user?.email])


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (input === '') return;

        try{
            //addDoc é uma função do firebase que adiciona um documento a uma coleção criando ja um ID Junto
            await addDoc(collection(db, "tasks"),{
                task: input,
                create: new Date(),
                user: user?.email,
                public: taskPublic
            })

            setInput("");
            setTaskPublic(false);

        }catch(err){
            console.error(err);
        }
    }

    const handleShare = async (id: string) =>{
        await navigator.clipboard.writeText(`${window.location.origin}/task/${id}`);
    }

    const handleDelete = async (id: string) => {
        const ref = doc(db, "tasks", id);
        await deleteDoc(ref);
    }


    return(
        <>
            <Head>
                <title>Painel</title>
            </Head>
            
            <main className="w-full h-screenWithHeader">
                <section className="bg-zinc-900">
                    <form onSubmit={handleSubmit} className="centralize py-16">
                        <TextArea 
                            value={input}
                            idTextArea="task" 
                            label="Qual sua tarefa?" 
                            placeholder="Digite aqui sua tarefa..." 
                            rows={5} 
                            labelColor="text-white"
                            textAreaColor="bg-zinc-800 border-zinc-700 focus:border-sky-600/40"
                            onChangeFunction={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                        />

                        <label htmlFor="setPublic" className="text-white flex gap-2 items-center mt-3">
                            <input 
                                type="checkbox" 
                                id="setPublic" 
                                checked={taskPublic} 
                                onChange={(e:ChangeEvent<HTMLInputElement>) => setTaskPublic(e.target.checked)}
                            />
                            Tornar tarefa pública
                        </label>

                        <button type="submit" className="bg-sky-500 text-white font-semibold text-xl rounded-lg w-full py-2 mt-4 transition-all duration-300 hover:bg-sky-700">
                            Registrar
                        </button>
                    </form>
                </section>

                <section className="w-full centralize py-16">
                    <h2 className="text-center font-bold text-4xl">Minhas tarefas</h2>

                    <ul>
                        {tasks.map(task => (
                            <li key={task.id} className="flex justify-between items-center p-4 rounded-lg mt-4 border border-zinc-600">

                                <div className="flex flex-col justify-center gap-2 w-full">
                                    {task.public === true && (
                                        <div className="flex items-center gap-2">
                                            <Link href={`/task/${task.id}`} className="bg-sky-500 py-1 px-2 font-semibold text-white rounded">
                                                PUBLICA
                                            </Link>

                                            <button onClick={() => handleShare(task.id)} className="text-sky-500 transition-all duration-300 hover:text-sky-600">
                                                <FaShare />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-black whitespace-pre-wrap">{task.task}</p>
                                </div>

                                <button onClick={() => handleDelete(task.id)} className="w-fit h-fit text-red-600 font-semibold text-2xl rounded-lg py-2 transition-all duration-300 hover:text-red-700 focus:outline-none">
                                    <LuTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
            
        </>
    )
}



//executando no servidor
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });
    
    if (!session?.user) {
        // Se o usuário n estiver logado, redireciona para o home
        return{
            redirect:{
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: {
            user:{
                email: session?.user.email
            }
        }
    }
}