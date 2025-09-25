import React from 'react';
import { IIconProps, PrimaryButton } from '@fluentui/react';
import { TooltipIconButton } from './tooltipIconButton';

import './fileUpload.css';
import { generateId } from './generateId';

export interface FileLoadProps {
    onChange: (file: File) => void;
    acceptType: string;
    label?: string;
    tooltip?: string;
    iconProps?: IIconProps;
    title?: string;
    disabled?: boolean;
    iconOnly?: boolean;
    className?: string;
    
}

export const FileUpload = React.memo(function FileUpload({ 
    onChange,
    acceptType,
    label,
    tooltip,
    iconProps,
    title,
    disabled,
    iconOnly, 
    className
 }: FileLoadProps) {

    const fileInput = React.useRef<HTMLInputElement>();

    const onClick = React.useCallback((e: any) => {
        e.stopPropagation();
        e.preventDefault();
        if (fileInput.current) {
            fileInput.current.click();
        }
    }, []);

    return (<>
        { !(iconOnly && iconProps?.iconName) 
            ? <PrimaryButton 
                onClick={onClick}
                label={label}
                iconProps={iconProps}
                title={title}
                disabled={disabled}
            />
            : <TooltipIconButton
                onClick={onClick}
                iconProps={iconProps}
                title={title}
                disabled={disabled}
                tooltip={tooltip || 'button'}
                className={className}
            />}
        <input
            type='file'
            ref={fileInput as any}
            accept={acceptType}
            name={`file-load-${generateId()}`}
            onChange={e => {
                if (e.target?.files?.length) {
                    onChange(e.target.files[0]);
                }
            }}
            className='file-input'
        />
    </>);
});