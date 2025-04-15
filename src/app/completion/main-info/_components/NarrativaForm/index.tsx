"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { diretorias, narrativas } from "../../_common";

const MainForm: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <span className="text-md font-semibold mt-4">
        1. Defina sua narrativa
      </span>

      <span className="text-sm font-normal text-gray-600">
        Selecione a narrativa que você deseja criar
      </span>

      <form className="flex gap-2 justify-end flex-col w-full mt-2">
        <Input placeholder="Título" />

        <div className="w-full gap-2 flex">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Narrativas</SelectLabel>
                {narrativas.map((narrativa) => (
                  <SelectItem value={narrativa.id} key={narrativa.id}>
                    {narrativa.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Diretoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Diretorias</SelectLabel>
                {diretorias.map((diretoria) => (
                  <SelectItem value={diretoria.id} key={diretoria.id}>
                    {diretoria.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  );
};

export default MainForm;
