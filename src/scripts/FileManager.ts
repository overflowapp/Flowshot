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
                name: 'Flowshot',
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

    private static readonly exportSettings = {
        assetFolder: 'assets',
        imageExt: 'png',
        screenSpacing: 200,
    };

    public static zipFiles(files: Shot[]) {
        console.log(`Zipping ${files.length} files`);
        const zip = new JSZip();
        const struct = { ...FileManager.flowStructure };
        const page = struct.document.children[0];
        const settings = { ...FileManager.exportSettings };
        let cumulativePosition = { x: 0, y: 0 };

        zip.folder(settings.assetFolder);

        files.forEach((data: Shot) => {
            const newScreenId = cuid();
            const imageName = `${newScreenId}.${settings.imageExt}`;
            const { x, y, w, h } = data.event.payload.boundingRect;

            zip.file(`${settings.assetFolder}/${imageName}`, Helpers.uriToBlob(data.tab.dataURI));

            const hotspot = {
                id: cuid(),
                name: null,
                type: Flow.Type.Hotspot,
                position: {
                    x: x * 2,
                    y: y * 2,
                },
                size: {
                    h: h * 2,
                    w: w * 2,
                },
                connections: [],
            } as Flow.Layer;

            console.log('setting screen id', newScreenId);

            page.children.push({
                id: newScreenId,
                name: `${data.tab.title} - ${Date.now()}`,
                source: {
                    dirPath: settings.assetFolder,
                    fileName: imageName,
                },
                children: [hotspot],
                size: { ...data.tab.size },
                position: { ...cumulativePosition },
                type: Flow.Type.Screen,
            });

            cumulativePosition.x += data.tab.size.w + settings.screenSpacing;
        });

        page.children.forEach((screen: Flow.Screen, i) => {
            page.children[i + 1] && console.log('looping children', page.children[i + 1].id);
            page.children[i + 1] &&
                screen.children[0].connections.push({
                    nodeID: page.children[i + 1].id,
                });
        });

        zip.file('data.json', JSON.stringify(struct));

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = `${struct.document.name}.flow`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
    }
}
