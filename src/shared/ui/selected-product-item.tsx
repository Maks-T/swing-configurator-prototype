import { InfoIcon, MoreHorizontalIcon, RefreshCwIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/shared/ui/item';

type SelectedProductItemProps = {
  name: string;
  previewPicture: string | null;
  onDetails: () => void;
  onReplace: () => void;
  onDelete: () => void;
};

export function SelectedProductItem({
  name,
  previewPicture,
  onDetails,
  onReplace,
  onDelete,
}: SelectedProductItemProps) {
  return (
    <ItemGroup>
      <Item
        size="sm"
        variant="outline"
        role="listitem"
        className="calc:cursor-pointer calc:flex-nowrap calc:hover:bg-muted/50"
        onClick={onReplace}
      >
        <ItemMedia variant="image" className="calc:bg-muted">
          {previewPicture ? <img src={previewPicture} alt="" /> : null}
        </ItemMedia>
        <ItemContent className="calc:min-w-0">
          <ItemTitle className="calc:line-clamp-2">{name}</ItemTitle>
        </ItemContent>
        <ItemActions
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Действия"
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onDetails}>
                  <InfoIcon />
                  Подробнее
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onReplace}>
                  <RefreshCwIcon />
                  Заменить
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                  <Trash2Icon />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}
