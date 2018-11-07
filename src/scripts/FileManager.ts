const JSZip = require('jszip');
import * as cuid from 'cuid';
import Helpers from '../utils/Helpers';
import { Shot } from '../types/types';
import Flow from '../../Flow/src/typings/Flow';

export default class FileManager {
    public static get flowStructure(): Flow.File {
        return {
            document: {
                id: cuid(),
                name: 'Flow Document',
                type: Flow.Type.Document,
                children: [
                    {
                        id: cuid(),
                        name: 'Tab Flow',
                        type: Flow.Type.Page,
                        backgroundColor: {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 1,
                        },
                        children: [],
                    },
                ],
            },
            settings: {
                grid: null,
                snapToGrid: false,
                snapToObjects: false,
            },
            schemaVersion: 1,
        };
    }

    public static get structure() {
        return {
            title: `Flowshot-${cuid.slug()}`,
            date: Date.now(),
            imageDir: 'assets',
            screens: [],
        };
    }

    public static zipFiles(files: Shot[]) {
        console.log('Zipping files');
        const zip = new JSZip();
        const baseSructure = { ...FileManager.structure };

        zip.folder(baseSructure.imageDir);

        files.forEach((data: Shot, i: number) => {
            const newScreenId = Helpers.genId();
            const imageName = `${newScreenId}.png`;
            const { x, y, w, h } = data.event.payload.boundingRect;

            zip.file(`${baseSructure.imageDir}/${imageName}`, Helpers.uriToBlob(data.tab.dataURI));

            baseSructure.screens.push({
                id: newScreenId,
                title: `${data.tab.title} - ${Date.now()}`,
                source: imageName,
                size: { ...data.tab.size },
                position: {
                    x: 0,
                    y: 0,
                },
                area: {
                    id: Helpers.genId(),
                    position: {
                        x: x * 2,
                        y: y * 2,
                    },
                    size: {
                        h: h * 2,
                        w: w * 2,
                    },
                },
            });
        });

        baseSructure.screens.forEach((screen, i) => {
            if (baseSructure.screens[i + 1]) {
                screen.area.destination = baseSructure.screens[i + 1].id;
            }
        });

        zip.file('data.json', JSON.stringify(baseSructure));

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = `${baseSructure.title}.flow`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
    }
}
