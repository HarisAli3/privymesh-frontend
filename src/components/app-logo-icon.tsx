import { type ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/logo.png"
            alt={props.alt ?? 'PrivyMesh Logo'}
            {...props}
        />
    );
}
