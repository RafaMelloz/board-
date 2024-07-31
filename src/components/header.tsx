import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export function Header(){

    const { data: session, status } = useSession();

    return (
        <header className="w-full min-h-20 bg-zinc-900">
            <nav className="max-w-7xl pb-4 sm:pb-0 px-10 xl:px-0 h-full w-full m-auto flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between items-center">
                <Link href={'/'} className="text-2xl text-white font-semibold">
                    <h1>Board<span className="text-sky-500 font-black text-3xl">+</span></h1>
                </Link>

                <div className="flex ">
                    {session && (
                        <Link href={'/dashboard'} className="text-black bg-white text-center py-2 px-4 rounded-full font-medium mx-4 bg-slate-20 text-nowrap">
                            Meu Painel
                        </Link>
                    )}

                    {status === "loading" ? (
                        <button className="text-white p-2 px-4 font-medium border bg-transparent border-white rounded-full transition-colors duration-300 hover:bg-white hover:text-zinc-900 text-nowrap" disabled>
                            Carregando...
                        </button>
                    ) : session ? (
                        <button
                            onClick={() => signOut()}
                            className="text-white p-2 px-4 font-medium border bg-transparent border-white rounded-full transition-colors duration-300 hover:bg-white hover:text-zinc-900 text-nowrap"
                        >
                            Olá {session?.user?.name}
                        </button>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            //o parâmetro é o provider que você quer usar para autenticar, se passar vazio abre um modal com todos os providers disponíveis
                            className="text-white p-2 px-4 font-medium border bg-transparent border-white rounded-full transition-colors duration-300 hover:bg-white hover:text-zinc-900 text-nowrap"
                        >
                            Minha conta
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}