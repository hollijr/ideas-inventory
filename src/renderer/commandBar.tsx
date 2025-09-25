import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';

import { ViewType } from './models';

export enum SelectedCommand {
  None,
  New,
  Upload,
  Slideshow,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  ViewType,
  Configure,
}

export interface IdeasCommandBarProps {
  activeCommand: SelectedCommand;
  setActiveCommand: (command: SelectedCommand) => void;
}

export const IdeasCommandBar = React.memo(function IdeasCommandBar({ activeCommand, setActiveCommand }: IdeasCommandBarProps) {

  const disabled = activeCommand !== SelectedCommand.None;

  const items: ICommandBarItemProps[] = [
    { 
      key: 'newItem', 
      text: 'New', 
      iconProps: { iconName: 'Add' }, 
      onClick: () => setActiveCommand(SelectedCommand.New),
      disabled,
    },
    { 
      key: 'upload', 
      text: 'Photo asset', 
      iconProps: { iconName: 'Upload' }, 
      onClick: () => setActiveCommand(SelectedCommand.Upload),
      disabled,
    },
    { 
      key: 'slideshow', 
      text: 'Slideshow', 
      iconProps: { iconName: 'Share' }, 
      onClick: () => setActiveCommand(SelectedCommand.Slideshow),
      disabled,
    },
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: 'tile',
      text: 'Grid view',
      // This needs an ariaLabel since it's icon-only
      ariaLabel: 'Grid view',
      iconOnly: true,
      iconProps: { iconName: 'Tiles' },
      onClick: () => setActiveCommand(SelectedCommand.ViewType),
      disabled,
    },
    {
      key: 'config',
      text: 'Configure',
      ariaLabel: 'Configure app',
      iconOnly: true,
      iconProps: { iconName: 'Info' },
      onClick: () => setActiveCommand(SelectedCommand.Configure),
      disabled,
    }
  ];

  return (
    <CommandBar
      items={items}
      farItems={farItems}
    />
  );
});
