import { useCallback, useMemo, useState } from 'react';

import { Action } from '../constants';

// Define the type for the output of the useGroupRadioActions hook
export type UseGroupRadioActionsOutput<T extends Action = Action> = {
  actions: T[];
  watchGroup: (group: T['group']) => Action | undefined;
  select: (group: T['group'], action: T['action']) => void;
  disableGroup: (group: T['group'], action?: Array<T['action']>) => void;
  deselect: (group: T['group']) => void;
  enableGroup: (group: T['group'], action?: Array<T['action']>) => void;
};

// Define the useGroupRadioActions hook
export const useGroupRadioActions = <T extends Action = Action>(
  initialActions: T[],
): UseGroupRadioActionsOutput<T> => {
  // Initialize the state for the actions
  const [actions, setActions] = useState<T[]>(initialActions);

  // Define the watchGroup function. It will filter the actions based on the group and return the selected action.
  const watchGroup = useCallback(
    (group: string): T | undefined => {
      return actions.find(
        action => action.group === group && action.isSelected,
      );
    },
    [actions],
  );

  // Define the select function. It will update the isSelected property of the specified action in the specified group,
  // if it's not disabled or already selected.
  const select = useCallback((group: T['group'], action: T['action']): void => {
    setActions(prevActions =>
      prevActions.map(prevAction => {
        if (prevAction.group === group) {
          if (prevAction.action === action && !prevAction.isDisabled) {
            return { ...prevAction, isSelected: true };
          } else {
            return { ...prevAction, isSelected: false };
          }
        }
        return prevAction;
      }),
    );
  }, []);

  // Define the disableGroup function. It will update the isDisabled property of the specified actions in the specified group.
  const disableGroup = useCallback(
    (group: T['group'], actionsNotToDisable?: Array<T['action']>): void => {
      setActions(prevActions =>
        prevActions.map(prevAction => {
          if (
            prevAction.group === group &&
            !actionsNotToDisable?.includes(prevAction.action)
          ) {
            return { ...prevAction, isDisabled: true };
          }
          return prevAction;
        }),
      );
    },
    [],
  );

  const deselect = useCallback((group: T['group']): void => {
    setActions(prevActions =>
      prevActions.map(prevAction => {
        if (prevAction.group === group) {
          return { ...prevAction, isSelected: false };
        }
        return prevAction;
      }),
    );
  }, []);

  const enableGroup = useCallback(
    (group: T['group'], actionsNotToEnable?: Array<T['action']>): void => {
      setActions(prevActions =>
        prevActions.map(prevAction => {
          if (
            prevAction.group === group &&
            !actionsNotToEnable?.includes(prevAction.action)
          ) {
            return { ...prevAction, isDisabled: false };
          }
          return prevAction;
        }),
      );
    },
    [],
  );

  // Return the actions, watchGroup, select, and disableGroup from the hook
  const state = useMemo(
    () => ({
      actions,
      watchGroup,
      select,
      disableGroup,
      deselect,
      enableGroup,
    }),
    [actions, watchGroup, select, disableGroup, deselect, enableGroup],
  );
  return state;
};
