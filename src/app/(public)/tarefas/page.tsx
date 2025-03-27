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
  const { mutateAsync: updateTarefa, isPending: isLoadingUpdate } =
    useUpdateTarefas();

  function onSubmit(data) {
    create(data, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
    });
  }

  function onUpdate(id, novoConteudo) {
    updateTarefa(
      { id, conteudo: novoConteudo },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
      }
    );
  }

  function onToggleConcluida(id, concluida) {
    updateTarefa(
      { id, concluida: !concluida }, // Alterna entre true/false
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
      }
    );
  }

  return (
    <div className="container mx-auto p-6">
      {isLoadingCriacao && (
        <span className="text-blue-500">Criando tarefa ...</span>
      )}

      <div className="flex justify-center mb-6">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit({ conteudo: formData.get("conteudo") });
          }}
        >
          <input
            name="conteudo"
            placeholder="Nova tarefa"
            className="border rounded px-4 py-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Criar
          </button>
        </form>
      </div>

      {isLoadingDelete && (
        <span className="text-red-500">Deletando Tarefa ...</span>
      )}

      {!isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((t) => (
            <div
              key={t.id}
              className={`shadow-lg rounded-lg p-4 border ${
                t.concluida
                  ? "bg-green-100 border-green-500"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3
                  className={`text-lg font-semibold ${
                    t.concluida
                      ? "text-green-700 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {t.conteudo}
                </h3>

                <button
                  className="text-red-500"
                  onClick={() =>
                    deletaNoticia(
                      { id: t.id },
                      {
                        onSuccess: () =>
                          queryClient.invalidateQueries({
                            queryKey: ["tarefas"],
                          }),
                      }
                    )
                  }
                >
                  ❌
                </button>
              </div>

              <input
                type="text"
                defaultValue={t.conteudo}
                className="mt-2 w-full border px-2 py-1 rounded"
                onBlur={(e) => onUpdate(t.id, e.target.value)}
              />

              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  checked={t.concluida}
                  onChange={() => onToggleConcluida(t.id, t.concluida)}
                  className="h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-400"
                />
                <label className="ml-2 text-sm text-gray-700">Concluída</label>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Por: {t.usuario.nome}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Carregando tarefas ....</p>
      )}
    </div>
  );
}
