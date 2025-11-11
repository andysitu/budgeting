import { Account, fetchAccounts } from "@/network/account";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

function Accounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);

    const getAccounts = async () => {
        try {
            const result = await fetchAccounts();
            setAccounts(result);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAccounts();
    }, []);

    return <div>
        <div>
            <button onClick={() => {
                //
            }}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    </div>;
}

export default Accounts;