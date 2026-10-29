import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Tabs from './components/tabs';
import Vendors from './components/pages/Vendors';
import Accounts from './components/pages/Accounts';
import HoldingTypes from './components/pages/HoldingTypes';
import Snackbar from './components/dialog/Snackbar';
import { HoldingTypeListItem, fetchHoldingTypes } from '@/network/holdingType';
import { addMessage } from '@/lib/features/snackbar/snackbarSlice';
import { useAppSelector } from '@/lib/hooks';

export default function Home() {
  const [types, setTypes] = useState<HoldingTypeListItem[]>([]);
  const dispatch = useDispatch();

  const { loggedIn } = useAppSelector((state) => state.userAccount);

  const refreshTypes = async () => {
    setTypes(await fetchHoldingTypes());
  };

  useEffect(() => {
    let active = true;
    if (!loggedIn) return;

    fetchHoldingTypes()
      .then((result) => {
        if (active) setTypes(result);
      })
      .catch(() => {
        if (active) dispatch(addMessage('Unable to load holding types.'));
      });
    return () => {
      active = false;
    };
  }, [dispatch, loggedIn]);

  return (
    <main>
      <div>
        <Tabs
          elements={{
            Accounts: (
              <Accounts
                types={types}
                onUpdate={() => {
                  void refreshTypes().catch(() =>
                    dispatch(addMessage('Unable to refresh holding types.')),
                  );
                }}
              />
            ),
            Vendors: <Vendors />,
            'Holding types': (
              <HoldingTypes types={types} onUpdate={refreshTypes} />
            ),
          }}
        />
      </div>
      <Snackbar />
    </main>
  );
}
