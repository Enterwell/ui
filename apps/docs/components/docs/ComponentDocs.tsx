import { parse as parseJsDoc } from 'comment-parser';
import { Mdx } from './Mdx';
import { Fragment } from 'react';
import hooksApi from '@enterwell/hooks/api';
import uiApi from '@enterwell/ui/api';

type ComponentDocsProps = {
    name: string;
};

const api = [
    ...hooksApi.members.find((m: any) => m.kind === "EntryPoint")?.members ?? [],
    ...uiApi.members.find((m: any) => m.kind === "EntryPoint")?.members ?? []
];

function componentMember(name: string) {
    return api?.find((m: any) => m.name === name);
}

function componentComment(name: string) {
    const member = componentMember(name);
    const comments = member ? parseJsDoc(member.docComment) : undefined;
    return comments?.at(0);
}

export function ComponentDescription({ name }: ComponentDocsProps) {
    const comment = componentComment(name);
    const { description } = comment || {};

    return (
        <Mdx>{description}</Mdx>
    )
}

export function ComponentParameters({ name }: ComponentDocsProps) {
    const member = componentMember(name);
    const comment = componentComment(name);
    const params = member?.parameters?.map((param: any) => ({
        name: param.parameterName,
        description: comment?.tags?.find((tag) => tag.tag === 'param' && tag.name === param.parameterName)?.description,
        optional: param.isOptional,
        type: member.excerptTokens.slice(param.parameterTypeTokenRange.startIndex, param.parameterTypeTokenRange.endIndex).map((t: any) => t.text).join(' '),
    }));

    if (!params?.length) {
        return (
            <div className="text-center text-gray-400">
                <p>No parameters</p>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-[auto_auto_1fr] gap-x-4 gap-y-1 items-center mt-2">
            {params?.map((param: any) => (
                <Fragment key={param.name}>
                    <div>
                        <span className="text-xl font-bold">{param.name}</span>
                    </div>
                    <div>
                        {param.type && <span className="text-muted-foreground">{param.type}</span>}
                        {param.optional && <span className="text-muted-foreground"> (optional)</span>}
                    </div>
                    <div>
                        <Mdx>{param.description?.trim().slice(1)}</Mdx>
                    </div>
                    <hr className="sm:hidden" />
                </Fragment>
            ))}
        </div>
    )
}
