import * as React from 'react';
import {
  DetailsList,
  Selection,
  IColumn,
  Image,
  MarqueeSelection,
  SelectionMode,
  DetailsListLayoutMode,
} from '@fluentui/react';
import { CookieIdea, CookieItem, Filter } from './models';

import './cookieList.css';

export interface CookieIdeasListProps {
  data: CookieIdea[];
  filter: Filter | undefined;
  // onDataChange: (data: CookieIdea[]) => void;
}

const frozenColumnCountFromStart = 1;
const frozenColumnCountFromEnd = 0;
const DEFAULT_COLUMN_ORDER = ['ideaImage', 'ideaName', 'cutterName', 'cutterImage', 'tags'];

export const CookieIdeasList = React.memo(function IdeasList(props: CookieIdeasListProps) {

  const [columnOrder, setColumnOrder] = React.useState<string[]>(DEFAULT_COLUMN_ORDER);
  
  const selection = new Selection();
  const items = useGetListItems(props.data, props.filter);
  const columns = useGetColumns(columnOrder);

  const handleColumnReorder = React.useCallback((draggedIndex: number, targetIndex: number) => {
    const columnKeys = columnOrder || DEFAULT_COLUMN_ORDER;
    const draggedItems = columnKeys[draggedIndex];
    const newColumnKeys: string[] = [...columnKeys];

    // insert before the dropped item
    newColumnKeys.splice(draggedIndex, 1);
    newColumnKeys.splice(targetIndex, 0, draggedItems);
    setColumnOrder(newColumnKeys);
  }, [columnOrder]);

  const columnReorderOptions = React.useMemo(() => {
    return {
      frozenColumnCountFromStart,
      frozenColumnCountFromEnd,
      handleColumnReorder,
    };
  }, [handleColumnReorder]);

  return (
    <div>
      <MarqueeSelection selection={selection}>
        {!!items.length && <DetailsList
          setKey='items'
          items={items}
          columns={columns}
          selection={selection}
          selectionMode={SelectionMode.multiple}
          selectionPreservedOnEmptyClick
          // onItemInvoked={onItemInvoked}
          columnReorderOptions={columnReorderOptions}
          ariaLabelForSelectionColumn='Toggle selection'
          ariaLabelForSelectAllCheckbox='Toggle selection for all items'
          checkButtonAriaLabel='select row'
          className='cookie-list-container'
          layoutMode={DetailsListLayoutMode.justified}
          isPlaceholderData={!items.length}
        />}
        {!items.length && (
          <div className='cookie-list-container cookie-list-placeholder'>
            There are currently no ideas to show. Click &apos;+ New&apos; to add one.
          </div>
        )}
      </MarqueeSelection>
    </div>
  );
});

function useGetListItems(data: CookieIdea[], filter: Filter | undefined): CookieItem[] {
  return React.useMemo(() => {
    const ideas: CookieIdea[] = data || [];
    const items: CookieItem[] = ideas.map(item => ideaToItem(item));
    return filter ? items.filter(item => isMatch(item, filter)) : items;
  }, [data, filter]);
}

function isMatch(item: CookieItem, filter: Filter): boolean {
  for (const field of Object.keys(filter)) {
    const value = filter[field];
    switch (field) {
      case 'tags': 
        if (!(item.tags.includes(value))) {
          return false
        }
        break;
      case 'ideaName':
        if (!(item.ideaName.match(value))) {
          return false
        }
        break;
      case 'cutterName':
        if (!(item.cutterName.match(value))) {
          return false
        }
        break;
      default:
        return false;
    }
  }
  return true;
}

function ideaToItem(idea: CookieIdea): CookieItem {
  return {
    ideaName: idea.name,
    ideaImage: idea.ideaImage,
    tags: idea.tags,
    cutterName: idea.cutter,
    cutterImage: idea.cutterImage
  };
}

type ColumnMap = { [key: string]: IColumn };

function useGetColumns(columnOrder: string[]): IColumn[] {
  const [columnDefs] = React.useState<ColumnMap>(getColumnDefinitions());
  return React.useMemo(() => {
    const columns: IColumn[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const key of columnOrder) {
      const column = columnDefs[key];
      columns.push(column);
    }
    return columns;
  }, [columnDefs, columnOrder]);
}

function getColumnDefinitions(): ColumnMap {
  const imageStyles = {
    root: {
      width: '100%'
    }
  };
  return {
    ideaImage: {
      key: 'ideaImage',
      name: 'Idea image',
      minWidth: 0,
      isResizable: true,
      flexGrow: 1,
      onRender: (item) => {
        return <Image 
          src={item?.ideaImage}
          styles={imageStyles} 
          imageFit={1} 
          loading='lazy' 
          maximizeFrame />;
      }
    },
    ideaName: {
      key: 'ideaName',
      name: 'Name',
      isResizable: true,
      flexGrow: 2,
      minWidth: 300,
      fieldName: 'ideaName'
    },
    cutterName: {
      key: 'cutterName',
      name: 'Cutter',
      isResizable: true,
      flexGrow: 2,
      minWidth: 0,
      fieldName: 'cutterName'
    },
    cutterImage: {
      key: 'cutterImage',
      name: 'Cutter image',
      isResizable: true,
      flexGrow: 1,
      minWidth: 0,
      onRender: (item) => {
        return <Image 
          src={item?.cutterImage}
          styles={imageStyles} 
          imageFit={1} 
          loading='lazy' 
          maximizeFrame />;
      }
    },
    tags: {
      key: 'tags',
      name: 'Tags',
      isResizable: true,
      flexGrow: 2,
      minWidth: 0,
      onRender: (item) => (<div>{item?.tags?.join(', ')}</div>)
    }
  };
}

