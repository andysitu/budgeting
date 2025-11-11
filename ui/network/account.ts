import { isEmptyObject } from "@/lib/common/util";
import { getConfiguration } from "./util";

export type Account = {
    name: string,
    description: string,
};

const fetchAccounts = async (params: Record<string, any> = {}): Promise<Account[]> => {
    const requestParam = getConfiguration("GET");

    const url = new URL("/api/accounts", window.location.origin);

    if (!isEmptyObject(params)) {
        for (const key in params) {
            url.searchParams.append(key, params[key]);
        }
    }
    const result = await fetch(url, requestParam);

    return result.json();
};

export { fetchAccounts };