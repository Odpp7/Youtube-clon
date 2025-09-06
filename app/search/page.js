"use client";
import { Suspense } from "react";
import SearchContent from "./searchContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SearchContent />
    </Suspense>
  );
}