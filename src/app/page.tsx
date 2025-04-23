import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="md:w-[600px] px-8 md:px-0 flex flex-col">
        <span className="font-semibold text-xl">
          NarrativasAI - Crie narrativas utilizando Inteligencia Artificial
        </span>
        <span className="mt-1">
          O intuito desta ferramenta é pensar juntamente com você em soluções
          para seus casos de uso.
        </span>

        <div className="w-full flex justify-end mt-4 ">
          <Link href={"/completion/main-info"}>
            <Button>Iniciar brainstorm</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
