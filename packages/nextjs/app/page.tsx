"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [txStatus, setTxStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { data: taskCount } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getTaskCount",
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    setTxStatus("loading");
    try {
      await writeContractAsync({
        functionName: "addTask",
        args: [newTask],
      });
      setNewTask("");
      setTxStatus("success");
    } catch (e) {
      setTxStatus("error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (index: number) => {
    setTxStatus("loading");
    try {
      await writeContractAsync({
        functionName: "toggleTask",
        args: [BigInt(index)],
      });
      setTxStatus("success");
    } catch (e) {
      setTxStatus("error");
    }
  };

  const count = taskCount ? Number(taskCount) : 0;

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-2xl">
        <h1 className="text-center text-4xl font-bold mb-2">Журнал задач</h1>
        <p className="text-center mb-6 text-gray-500">Кошелёк: {connectedAddress ?? "не подключён"}</p>

        <div className="bg-base-200 rounded-2xl p-4 mb-6 text-center">
          <span className="text-2xl font-bold">{count}</span>
          <span className="ml-2 text-gray-500">задач всего</span>
        </div>

        {txStatus === "loading" && <div className="alert alert-info mb-4">⏳ Транзакция отправляется...</div>}
        {txStatus === "success" && <div className="alert alert-success mb-4">✅ Транзакция прошла успешно!</div>}
        {txStatus === "error" && <div className="alert alert-error mb-4">❌ Ошибка транзакции</div>}

        <div className="flex gap-2 mb-8">
          <input
            className="input input-bordered flex-1"
            placeholder="Введите название задачи..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddTask} disabled={isAdding}>
            Добавить
          </button>
        </div>

        <TaskList count={count} onToggle={handleToggle} />
      </div>
    </div>
  );
};

const TaskItem = ({ index, onToggle }: { index: number; onToggle: (index: number) => void }) => {
  const { data } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getTask",
    args: [BigInt(index)],
  });

  if (!data) return null;

  const [title, completed] = data;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl mb-3 ${completed ? "bg-success/20" : "bg-base-200"}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{completed ? "✅" : "⬜"}</span>
        <span className={completed ? "line-through text-gray-400" : ""}>{title}</span>
      </div>
      <button className={`btn btn-sm ${completed ? "btn-warning" : "btn-success"}`} onClick={() => onToggle(index)}>
        {completed ? "Отменить" : "Выполнено"}
      </button>
    </div>
  );
};

const TaskList = ({ count, onToggle }: { count: number; onToggle: (index: number) => void }) => {
  if (count === 0) {
    return <p className="text-center text-gray-400">Задач пока нет. Добавьте первую!</p>;
  }

  return (
    <div>
      {Array.from({ length: count }, (_, i) => (
        <TaskItem key={i} index={i} onToggle={onToggle} />
      ))}
    </div>
  );
};

export default Home;
