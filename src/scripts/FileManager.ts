const JSZip = require('jszip');
import * as cuid from 'cuid';
import Helpers from '../utils/Helpers';
import { Shot } from '../types/types';

export default class FileManager {
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
                        x: data.event.payload.boundingRect.x * 2,
                        y: data.event.payload.boundingRect.y * 2,
                    },
                    size: {
                        h: data.event.payload.boundingRect.h * 2,
                        w: data.event.payload.boundingRect.w * 2,
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
