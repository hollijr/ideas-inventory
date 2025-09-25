import { DefaultButton, Panel, PrimaryButton, TextField } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import * as React from 'react';
import { CookieIdea } from './models';

import './addItem.css';
import { FileUpload } from './core/fileUpload';
import { validImageFileType } from './utils';

export interface AddItemProps {
    onAddIdea: (idea: CookieIdea) => void;
    onDismiss: () => void;
    idea?: CookieIdea;  // populated on update
}

interface IdeaErrors {
    name: string;
    cutter?: string;
    ideaImage?: string;
    cutterImage?: string;
    tagsString?: string;
}

type CookieIdeaInput = CookieIdea & { tagsString: string };

const newItem: CookieIdeaInput = {
    name: '',
    cutter: '',
    ideaImage: '',
    cutterImage: '',
    tagsString: '',
    tags: []
};

enum PhotoType {
    IDEA,
    CUTTER,
}

export const AddItem = React.memo(function AddItem({ idea, onAddIdea, onDismiss}: AddItemProps) {
    const [isOpen, setIsOpen] = useBoolean(true);
    const [item, setItem] = React.useState<CookieIdeaInput>( idea 
        ? { ...idea, tagsString: idea.tags.join(', ') } 
        : { ...newItem });
    const [errors, setErrors] = React.useState<IdeaErrors>();
    const [save, setSave] = useBoolean(false);

    const [ideaPhotoFile, setIdeaPhotoFile] = React.useState<File>();
    const [ideaThumbnailSrc, setIdeaThumbnailSrc] = React.useState<string>();
    const [cutterPhotoFile, setCutterPhotoFile] = React.useState<File>();
    const [cutterThumbnailSrc, setCutterThumbnailSrc] = React.useState<string>();

    const onSelectPhotoFile = React.useCallback((file: File, type: PhotoType) => {
        let newIdea: CookieIdeaInput;
        switch (type) {
            case PhotoType.IDEA:
                newIdea = {...item, ideaImage: file.path};
                setIdeaPhotoFile(file);
                break;
            case PhotoType.CUTTER:
                newIdea = {...item, cutterImage: file.path};
                setCutterPhotoFile(file);
                break;
            default:
                newIdea = {...item};
                break;
        }
        setItem(newIdea);
    }, [item]);

    const onValidateAndSave = React.useCallback(() => {
        if (!item.name) {
            setErrors({ ...errors, name: 'Name is required' });
            setSave.setFalse();
        } else {
            setErrors(undefined);
            setSave.setTrue();
        }
    }, [errors, item.name, setSave]);

    const onRenderFooterContent = React.useCallback(() => {
        return (
          <div>
            <PrimaryButton onClick={onValidateAndSave} styles={{ root: { marginRight: 8 } }}>
              Save
            </PrimaryButton>
            <DefaultButton onClick={onDismiss}>Cancel</DefaultButton>
          </div>
        )}, [onDismiss, onValidateAndSave]
    );

    const ideaPhotoLabel = 'Choose idea photo';
    const cutterPhotoLabel = 'Choose cutter photo';

    React.useEffect(() => {
        const ideaThumbnail = ideaPhotoFile && validImageFileType(ideaPhotoFile) ? URL.createObjectURL(ideaPhotoFile) : undefined;
        setIdeaThumbnailSrc(ideaThumbnail);
    }, [ideaPhotoFile]);

    React.useEffect(() => {
        const cutterThumbnail = cutterPhotoFile && validImageFileType(cutterPhotoFile) ? URL.createObjectURL(cutterPhotoFile) : undefined;
        setCutterThumbnailSrc(cutterThumbnail);
    }, [cutterPhotoFile]);

    React.useEffect(() => {
        if (save) {
            onAddIdea(item);
            setSave.setFalse();
            setIsOpen.setFalse();
        }
    }, [item, onAddIdea, save, setIsOpen, setSave]);

    return (
        <Panel 
            isOpen={isOpen}
            onDismiss={onDismiss} 
            headerText='Add new idea'
            onRenderFooterContent={onRenderFooterContent}
            isFooterAtBottom
            closeButtonAriaLabel='Close'
        >
            <div className='add-item-container'>      
                <TextField label='Idea name (unique)' required value={item.name} errorMessage={errors?.name} />
                {ideaPhotoFile && <img src={ideaThumbnailSrc} alt={ideaPhotoFile.name} className='add-item-thumbnail'/>}
                {!ideaPhotoFile && <div className='add-item-thumbnail'>No photo selected</div>}
                <FileUpload 
                    onChange={(file) => onSelectPhotoFile(file, PhotoType.IDEA)} 
                    acceptType='image/png, image/jpeg'
                    label={ideaPhotoLabel}
                    title={ideaPhotoLabel}
                    iconProps={{ iconName: 'openFile'}}
                    className='icon-button margin-end-xsmall'
                />
                <TextField label='Idea photo' value={item.ideaImage} errorMessage={errors?.ideaImage} />
                <TextField label='Cutter' value={item.cutter} errorMessage={errors?.cutter} />
                {cutterPhotoFile && <img src={cutterThumbnailSrc} alt={cutterPhotoFile.name} className='add-item-thumbnail'/>}
                {!cutterPhotoFile && <div className='add-item-thumbnail'>No photo selected</div>}
                <FileUpload 
                    onChange={(file) => onSelectPhotoFile(file, PhotoType.CUTTER)} 
                    acceptType='image/png, image/jpeg'
                    label={cutterPhotoLabel}
                    title={cutterPhotoLabel}
                    iconProps={{ iconName: 'openFile'}}
                    className='icon-button margin-end-xsmall'
                />
                <TextField label='Cutter photo' value={item.cutterImage} errorMessage={errors?.cutterImage} />
                <TextField label='Tags' value={item.tagsString} errorMessage={errors?.tagsString} />
            </div>
        </Panel>
    )
});
