import { TransactionMeta } from '@metamask/transaction-controller';
import { rpcErrors, serializeError } from '@metamask/rpc-errors';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import {
  disableAccountUpgrade,
  rejectPendingApproval,
} from '../../../store/actions';
import { useConfirmContext } from '../context/confirm';

export function useSmartAccountActions() {
  const dispatch = useDispatch();
  const { currentConfirmation } = useConfirmContext<TransactionMeta>();
  const { id: confirmationId, chainId, txParams } = currentConfirmation ?? {};
  const { from } = txParams ?? {};

  const handleRejectUpgrade = useCallback(async () => {
    if (!chainId || !from) {
      return;
    }
    const error = rpcErrors.methodNotSupported('User rejected account upgrade');
    const serializedError = serializeError(error);

    await disableAccountUpgrade(chainId as string, from);

    dispatch(rejectPendingApproval(confirmationId, serializedError));
  }, [dispatch, confirmationId, chainId, from]);

  return { handleRejectUpgrade };
}
