import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex-col justify-center items-center h-screen p-40">
      <Input placeholder="email" />
      <Input placeholder="senha" className="mt-5" />
      <Button className="w-full mt-5">Entrar</Button>
    </div>
  );
}
