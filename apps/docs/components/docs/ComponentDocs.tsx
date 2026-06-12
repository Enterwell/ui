'use client';

import { parse as parseJsDoc } from 'comment-parser';
import { Mdx } from './Mdx';
import { Fragment, PropsWithChildren } from 'react';
import hooksApi from '@enterwell/react-hooks/api';
import uiApi from '@enterwell/react-ui/api';
import muiHooksApi from '@enterwell/react-mui-hooks/api';

/**
 * Supported library badge types.
 */
type Library = 'MUI' | 'MUI X' | 'MUI X Pro';

const libraryDefinitions: Record<Library, { label: string; url: string; className: string }> = {
    'MUI': {
        label: 'MUI',
        url: 'https://mui.com/material-ui/',
        className: 'bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-600/20',
    },
    'MUI X': {
        label: 'MUI X',
        url: 'https://mui.com/x/introduction/',
        className: 'bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-600/20',
    },
    'MUI X Pro': {
        label: 'MUI X Pro',
        url: 'https://mui.com/x/introduction/licensing/#pro-plan',
        className: 'bg-green-600/10 text-green-700 dark:text-green-300 border-green-600/20',
    },
};

type ComponentDocsProps = {
    name: string;
    libraries?: Library[];
};

type ComponentSource = PropsWithChildren<{
    packageName: string;
    path: string;
    name: string;
}>;

const api = [
    ...hooksApi.members.find((m: any) => m.kind === "EntryPoint")?.members ?? [],
    ...uiApi.members.find((m: any) => m.kind === "EntryPoint")?.members ?? [],
    ...muiHooksApi.members.find((m: any) => m.kind === "EntryPoint")?.members ?? [],
];

function componentMember(name: string) {
    return api?.find((m: any) => m.name === name);
}

function componentComment(name: string) {
    const member = componentMember(name);
    const comments = member ? parseJsDoc(member.docComment) : undefined;
    return comments?.at(0);
}

export function ComponentDescription({ name, libraries }: ComponentDocsProps) {
    const comment = componentComment(name);
    const { description } = comment || {};

    return (
        <div className='pt-2'>
            <Mdx>{description}</Mdx>
            {libraries && libraries.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-3'>
                    {libraries.map((lib) => {
                        const def = libraryDefinitions[lib];
                        return (
                            <a
                                key={lib}
                                href={def.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border no-underline hover:opacity-80 transition-opacity ${def.className}`}
                            >
                                {def.label}
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export function ComponentParameters({ name }: ComponentDocsProps) {
    const member = componentMember(name);
    const comment = componentComment(name);
    const params = member?.parameters?.map((param: any) => ({
        name: param.parameterName,
        description: comment?.tags?.find((tag) => tag.tag === 'param' && tag.name === param.parameterName)?.description,
        optional: param.isOptional,
        type: member.excerptTokens.slice(param.parameterTypeTokenRange.startIndex, param.parameterTypeTokenRange.endIndex)?.map((t: any) => t.text).join('')
    }));
    const returnsComment = comment?.tags?.find((tag) => tag.tag === 'returns');
    const returnsType = member?.returnTypeTokenRange 
        ? member.excerptTokens.slice(member.returnTypeTokenRange.startIndex, member.returnTypeTokenRange.endIndex)?.map((t: any) => t.text).join('')
        : undefined;
    const returnsTypeValid = returnsType && returnsType !== 'void';

    if (!params?.length && !returnsTypeValid) {
        return (
            <div className="text-center text-gray-400">
                <p>No parameters</p>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-[auto_auto_1fr] gap-x-4 gap-y-2 items-baseline mt-2">
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
            {returnsTypeValid && (
                <>
                    <h4 className='text-xl font-bold text-right' title="Returns">{'=>'}</h4>
                    <div>
                        {returnsType && <span className="text-muted-foreground">{returnsType}</span>}
                    </div>
                    <div>
                        <Mdx>{([returnsComment?.name, returnsComment?.description].filter(Boolean).join(' '))?.trim()}</Mdx>
                    </div>
                </>
            )}
        </div>
    )
}

export function ComponentSource({ children }: ComponentSource) {
    return (
        <div className='pt-6'>
            {children}
        </div>
    )
}
