import { useMemo } from "react";
import { generateFakeUser } from "@/utiils/generateFakeUser";

export function useFakeUser() {
    return useMemo(() => generateFakeUser(), []);
}
