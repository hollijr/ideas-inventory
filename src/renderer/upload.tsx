import { DefaultButton, Panel, PrimaryButton } from '@fluentui/react';
import * as React from 'react';

import { useBoolean } from '@fluentui/react-hooks';
import { FileUpload } from './core/fileUpload';

import './upload.css';
import { validImageFileType } from './utils';

export const UploadPhoto = React.memo(function UploadPhoto({ onUploadFile, onDismiss }: { 
    onUploadFile: (file:File) => void,
    onDismiss: () => void;
}) {
    const [photoFile, setPhotoFile] = React.useState<File>();
    const [thumbnailSrc, setThumbnailSrc] = React.useState<string>();
    const [isOpen, setIsOpen] = useBoolean(true);

    const onSelectFile = React.useCallback((file: File) => {
        setPhotoFile(file);
    }, []);

    const onSave = React.useCallback(() => {
        if (photoFile) {
            onUploadFile(photoFile);
        }
        setIsOpen.setFalse();
    }, [onUploadFile, photoFile, setIsOpen]);

    const onRenderFooterContent = React.useCallback(() => {
        return (
          <div>
            <PrimaryButton onClick={onSave} styles={{ root: { marginRight: 8 } }}>
              Save
            </PrimaryButton>
            <DefaultButton onClick={onDismiss}>Cancel</DefaultButton>
          </div>
        )}, [onDismiss, onSave]
    );

    const label = 'Choose photo';
    const showPhoto = !!photoFile;

    React.useEffect(() => {
        const thumbnail = photoFile && validImageFileType(photoFile) ? URL.createObjectURL(photoFile) : undefined;
        setThumbnailSrc(thumbnail);
    }, [photoFile]);

    return (
        <Panel 
            isOpen={isOpen}
            onDismiss={onDismiss} 
            headerText='Upload photo'
            onRenderFooterContent={onRenderFooterContent}
            isFooterAtBottom
            closeButtonAriaLabel='Close'
        >
            <div className='upload-container'>      
                <FileUpload 
                    onChange={onSelectFile} 
                    acceptType='image/png, image/jpeg'
                    label={label}
                    title={label}
                    iconProps={{ iconName: 'openFile'}}
                    className='icon-button margin-end-xsmall'
                />
                <div title={photoFile?.path || 'No file selected'}>
                    {photoFile?.path || 'No file selected'}
                </div>
            </div>
            {showPhoto && <div className='upload-photo-details'>
                <img src={thumbnailSrc} alt={photoFile.name}/>
                <div><span className='upload-photo-label'>Name:</span> {photoFile.name}</div>
                <div><span className='upload-photo-label'>Size:</span> {photoFile.size}</div>
            </div>}
        </Panel>
    )
});

