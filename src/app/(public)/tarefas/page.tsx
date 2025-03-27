"use client";

import {
  useCreateTarefa,
  useDeleteTarefa,
  useTarefas,
  useUpdateTarefas,
} from "./actions/fetchTarefas";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export default function Tarefas() {
  const queryClient = useQueryClient();
  const { isLoading, data, isFetching } = useTarefas();
  const { mutateAsync: create, isPending: isLoadingCriacao } =
    useCreateTarefa();
  const { mutateAsync: deletaNoticia, isPending: isLoadingDelete } =
    useDeleteTarefa();

  const { mutateAsync: updateNoticia, isPending: isLoadingUpdate } =
    useUpdateTarefas();

  function onSubmit(data: any) {
    console.log(data);
    create(data, {
      onSuccess: () => {
        console.log("Sucesso");
        queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      },
      onError: () => {
        console.log("Erro");
      },
    });
  }

  return (
    <>
      {isLoadingCriacao && <span>Criando tarefa ...</span>}
      <div className="flex justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit({
              conteudo: formData.get("conteudo"),
            });
          }}
        >
          <input name="conteudo" placeholder="conteudo" />
          <button type="submit">Criar</button>
        </form>
        {isLoadingDelete && <span>Deletando Tarefa ...</span>}
      </div>
      {!isFetching ? (
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {data?.map((t: any) => (
            <article
              key={t.id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-gray-500">2025-03-15</time>
                <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                  Tecnologia
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                  <Link href={`/tarefas/${t.id}`}>
                    <span className="absolute inset-0" />
                    {t.conteudo}
                  </Link>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
                  {t.conteudo}
                </p>
              </div>

              <button
                className="text-red-500"
                onClick={() => {
                  deletaNoticia(
                    {
                      id: t.id,
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: ["tarefas"],
                        });
                      },
                    }
                  );
                }}
              >
                Deletar
              </button>
              <div className="relative mt-8 flex items-center gap-x-4">
                <div className="text-sm/6">
                  <p className="font-semibold text-gray-900">
                    <span>
                      <span className="absolute inset-0" />
                      {t.usuario.nome}
                    </span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <>Carregando tarefas ....</>
      )}
    </>
  );
}
