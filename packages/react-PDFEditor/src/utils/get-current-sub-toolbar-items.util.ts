import {
  ActionableActions,
  ActionAndSubToolbarItemMappingType,
} from '../types';

export function getSubToolbarItemByPrimaryTool(
  mapping: ActionAndSubToolbarItemMappingType,
  primaryToolbarItem?: ActionableActions | undefined,
) {
  return primaryToolbarItem ? mapping[primaryToolbarItem] || [] : [];
}
