"use client";

import { useCallback, useEffect, useState } from "react";
import type { Initiative } from "./types";
import {
  deleteInitiative,
  loadInitiatives,
  saveInitiatives,
  upsertInitiative,
} from "./storage";

export function useInitiatives() {
  const [items, setItems] = useState<Initiative[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadInitiatives());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveInitiatives(items);
  }, [items, ready]);

  const add = useCallback((initiative: Initiative) => {
    setItems((prev) => upsertInitiative(prev, initiative));
  }, []);

  const update = useCallback((initiative: Initiative) => {
    setItems((prev) =>
      upsertInitiative(prev, { ...initiative, updatedAt: new Date().toISOString() }),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => deleteInitiative(prev, id));
  }, []);

  return { items, ready, add, update, remove };
}
