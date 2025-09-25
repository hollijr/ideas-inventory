import * as React from 'react';
import {
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { CookieIdeasList } from "./cookieList";
import { CookieIdea, Filter, ViewType } from "./models";
import { IdeasCommandBar, SelectedCommand } from './commandBar';

import './ideasInventory.css';
import { UploadPhoto } from './upload';
import { AddItem } from './addItem';

export const IdeasInventory = React.memo(function Ideas() {
  const [updateConfig, setUpdateConfig] = useBoolean(true);
  const [configData, setConfigData] = React.useState<object>({}); // json object containing configuration values
  const [updateData, setUpdateData] = useBoolean(true);
  const [data, setData] = React.useState<CookieIdea[]>([]); // json array content from the data storage file
  const [error, setError] = React.useState<string>();
  const [viewType, setViewType] = React.useState<ViewType>(ViewType.LIST);
  const [filter, setFilter] = React.useState<Filter>();
  const [activeCommand, setActiveCommand] = React.useState(SelectedCommand.None);
  
  React.useEffect(() => {
    if (updateConfig) {
      (async () => {
        try {
          const path = process.env.CONFIG_PATH;
          if (!path) {
            throw Error('Environment variable CONFIG_PATH could not be found.');
          }
          const content = await window.electron.ipcRenderer.loadFile(path);
          setConfigData(content ? JSON.parse(content) : {});
        } catch (e: any) {
          console.log(e);
          setError(e.message);
          setConfigData({});
        }
        setUpdateConfig.setFalse();
      })();
    }
  }, [setUpdateConfig, updateConfig]);

  React.useEffect(() => {
    if (updateData) {
      (async () => {
        try {
          const path = process.env.IDEAS_DATA_PATH;
          if (!path) {
            throw Error('Environment variable IDEAS_DATA_PATH could not be found.');
          }
          const content = await window.electron.ipcRenderer.loadFile(path);
          setData(content?.length ? JSON.parse(content) : []);
        } catch (e: any) {
          console.log(e);
          setError(e.message);
          setData([]);
        }
        setUpdateData.setFalse();
      })();
    }
  }, [setUpdateData, updateData]);

  const onDismiss = React.useCallback(() => setActiveCommand(SelectedCommand.None), []);

  // Command bar actions
  /* export enum SelectedCommand {
    None,
    New,
    Upload,
    Slideshow,
    ViewType,
    Configure,
  } */
  const onAddIdea = React.useCallback(() => {
    setActiveCommand(SelectedCommand.None);
  }, []);

  const onUploadFile = React.useCallback(async (file: File) => {
    // call ipcRenderer to upload and save the file to the photos directory
    const photosPath = process.env.PHOTOS_PATH;
    try {
      if (!photosPath) {
        throw Error('Environment variable PHOTOS_PATH could not be found.');
      }
      if (!(file instanceof File)) {
        throw new Error('Selection is not a valid file');
      }
      await window.electron.ipcRenderer.saveFile(photosPath, file.name, file.path);
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
    setActiveCommand(SelectedCommand.None);
    onDismiss();
  }, [onDismiss]);

  const onUpdateConfig = React.useCallback((config: any) => {
    setConfigData(config);
    setActiveCommand(SelectedCommand.None);
  }, []);

  const onViewTypeChange = React.useCallback(() => {
    const newViewType = viewType === ViewType.LIST ? ViewType.GRID : ViewType.LIST;
    setViewType(newViewType);
    setActiveCommand(SelectedCommand.None);
  }, [viewType]);

  // List actions
  const onDataChange = React.useCallback((newData: CookieIdea[]) => {
      // update data file

      setUpdateData.setTrue();
  }, [setUpdateData]);

  const showList = viewType === ViewType.LIST;
  const showAddItem = activeCommand === SelectedCommand.New;
  const showUpload = activeCommand === SelectedCommand.Upload;

  return (
    <div className='inv-page-container'>
      <div className='inv-page-inner-container'>
        {error && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={() => setError(undefined)}
            dismissButtonAriaLabel="Close"
            className="margin-bottom-xsmall"
          >
            {error}
          </MessageBar>
        )}
        <div className='inv-commandbar'>
          <IdeasCommandBar activeCommand={activeCommand} setActiveCommand={setActiveCommand} />
        </div>
        <div className='inv-list'>
          {showList && 
            <CookieIdeasList
              data={data}
              // onDataChange={onDataChange}
              filter={filter}
            />
          }
        </div>
        {showUpload && 
          <UploadPhoto onUploadFile={onUploadFile} onDismiss={onDismiss} />
        }
        {showAddItem &&
          <AddItem idea={undefined} onAddIdea={onAddIdea} onDismiss={onDismiss} />
        }
      </div>
    </div>
  );
});