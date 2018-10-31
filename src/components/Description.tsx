import * as React from 'react';
interface Props {
    title: string;
    titleClass?: string;
    content: string;
}

const Description = ({ title, titleClass, content }: Props) => (
    <div className="ph6 pt2 text-left">
        <h2 className={titleClass}>{title}</h2>
        <p className="mb6">{content}</p>
    </div>
);

export default Description;
